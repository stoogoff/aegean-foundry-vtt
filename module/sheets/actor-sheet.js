
import { AEGEAN } from '../helpers/config.js'
import { sortByProperty, add } from '../helpers/list.js'
import { SkillCheck } from '../dialogs/skill-check.js'

export class AegeanActorSheet extends ActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'actor'],
			template: 'systems/aegean/templates/actor/actor-character-sheet.html',
			width: 800,
			height: 600,
			tabs: [
				{
					navSelector: '.tab-group',
					contentSelector: '.tab-panel',
					initial: 'character_stats',
				},
			],
		})
	}

	/** @override */
	get template() {
		return `systems/aegean/templates/actor/actor-${this.actor.type}-sheet.html`
	}

	/* -------------------------------------------- */

	/** @override */
	async getData() {
		const context = super.getData()
		const actor = this.actor.toObject(false)

		context.config = AEGEAN
		context.system = actor.system
		context.flags = actor.flags.aegean

		context.advantages = this.actor.advantages
		context.armour = this.actor.armour
		context.equipment = this.actor.equipment.sort(sortByProperty('name'))
		context.gods = this.actor.gods
		context.parents = game.items.filter(item => item.type === 'deity' && item.system.stats.Parent.value).map(({ name }) => name)
		context.talents = this.actor.talents
		context.weapons = this.actor.weapons

		context.system.background.Fate.value = await TextEditor.enrichHTML(context.system.background.Fate.value, { async: true })

		console.log('Aegean | ActorSheet::getData', context)

		return context
	}

	activateListeners(html) {
		super.activateListeners(html)
	
		if (!this.isEditable) return

		// enable delete actions
		html.find('.delete-action').click(this._deleteItem.bind(this))

		// enable accordions
		html.find('.accordion-activator').click(event => {
			$(event.currentTarget).closest('.accordion').toggleClass('active')
		})

		// enable updating linked item properties
		html.find('.rating-input').change(this._updateItemProperty(this.actor.talents).bind(this))
		html.find('.set-favour').change(this._updateItemProperty(this.actor.gods).bind(this))

		// enable clicking on the risk track
		html.find('.risk .track .boxed').click(this._setRisk.bind(this))

		// display roll dialogue
		html.find('.roll').click(this._createRollDialog.bind(this))

		// skill specialisations and hide the inputs
		html.find('.add-spec').click(this._editSpecs.bind(this))
		html.find('.specialisations input').hide()

		// wounds and damage
		html.find('.damage-action').click(this._applyDamage.bind(this))
		html.find('.heal-wound').click(this._healWound.bind(this))
		html.find('.remove-wound').click(this._removeWound.bind(this))
		html.find('.recovery-action').click(this._recoveryRollDialog.bind(this))
	}

	_createRollDialog(selection) {
		const context = this.actor.getRollData()

		context.actor = this.actor.toObject(false)
		context.config = AEGEAN

		console.log('Aegean | ActorSheet::_createRollDialog => context', context)

		SkillCheck.show(context, selection)
	}

	_recoveryRollDialog() {
		this._createRollDialog({
			skill: 'Vigour',
		})
	}

	_applyDamage(event) {
		const value = parseInt($(event.currentTarget).parent('.action-bar').find('.damage-value').val())

		console.log(`Aegean | ActorSheet::_applyDamage => value=${value}`)

		this.actor.applyDamage(value)
	}

	_healWound(event) {
		const woundId = $(event.currentTarget).attr('data-id')

		console.log(`Aegean | ActorSheet::_healWound => woundId=${woundId}`)

		const wound = (this.actor.system.attributes.Wounds.value || []).find(({ id }) => id === woundId)

		wound.healed = true

		this.actor.update({
			'system.attributes.Wounds.value': [ ...this.actor.system.attributes.Wounds.value ]
		})
	}

	_removeWound(event) {
		const woundId = $(event.currentTarget).attr('data-id')

		console.log(`Aegean | ActorSheet::_removeWound => woundId=${woundId}`)

		const wounds = (this.actor.system.attributes.Wounds.value || []).filter(({ id }) => id !== woundId)

		this.actor.update({
			'system.attributes.Wounds.value': wounds
		})
	}

	_deleteItem(event) {
		const deleteId = $(event.currentTarget).attr('data-id')

		this.actor.deleteEmbeddedDocuments('Item', [ deleteId ])
	}

	_updateItemProperty(list) {
		return event => {
			const target = $(event.currentTarget)
			const dataId = target.attr('data-id')
			const key = target.attr('name')
			const value = target.val()

			console.log('Aegean | ActorSheet::_updateItemProperty => dataId, key, value', dataId, key, value)

			const obj = list.find(({ id }) => id === dataId)

			obj.update({
				[key]: value
			})			
		}
	}

	_setRisk(event) {
		const target = $(event.currentTarget)

		if(!target.hasClass('current')) {
			this.actor.setRisk(parseInt(target.attr('data-value')))
		}
	}

	_editSpecs(event) {
		const target = $(event.currentTarget)
		const parent = target.parent('.specialisations')
		const skill = target.attr('data-id')

		console.log(`Aegean | ActorSheet::_onEditSpecs => skill='${skill}'`)

		parent.find('ul').hide()
		parent.find('input').show().blur(blurEvent => {
			const specialisations = this.actor.system.specialisations.value

			specialisations[skill] = $(blurEvent.currentTarget).val().split(',').map(val => val.trim()).filter(val => val !== '')

			console.log('Aegean | ActorSheet::_onEditSpecs => specialisations', specialisations)

			this.actor.update({
				'system.specialisations.value': specialisations
			})
		})
	}

	async _onDropItem(event, data) {
		if(!event.dataTransfer) return

		let dragData = JSON.parse(event.dataTransfer.getData('text/plain'))

		console.log('Aegean | ActorSheet::_onDropItem => dragData', dragData)

		// load the item by uuid (remove the Item prefix)
		const dragItem = game.items.get(dragData.uuid.replace('Item.', ''))

		console.log('Aegean | ActorSheet::_onDropItem => dragItem', dragItem)

		if(!dragItem) return

		switch(dragItem.type) {
			// properties can't be dropped on a character
			case 'property':
				return

			// talents can only be dropped on a character once,
			// unless they're ranked or multiple
			case 'talent':
				if(!dragItem.system.stats.Ranked.value && !dragItem.system.stats.Multiple.value) {
					const existing = this.actor.talents.find(talent => talent.flags.core.sourceId === dragData.uuid)

					if(existing) return
				}
		}

		super._onDropItem(event, data)
	}
}
