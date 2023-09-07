
import { AEGEAN } from '../helpers/config.js'
import { sortByProperty, add } from '../helpers/list.js'
import { SkillCheck } from '../dialogs/skill-check.js'
import { woundRoll } from '../helpers/wounds.js'

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
	}

	_createRollDialog() {
		const context = this.actor.getRollData()

		context.actor = this.actor.toObject(false)
		context.config = AEGEAN

		console.log('Aegean | ActorSheet::_createRollDialog => context', context)

		SkillCheck.show(context)
	}

	_applyDamage(event) {
		const value = parseInt($(event.currentTarget).parent('.action-bar').find('.damage-value').val())

		console.log(`Aegean | ActorSheet::_applyDamage => value=${value}`)

		this.applyDamage(value)
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
			this.setRisk(parseInt(target.attr('data-value')))
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

	// methods for applying damage
	// ideally these would be on the actor

	// apply damage by subtracting armour
	applyDamage(damage) {
		const armour = parseInt(this.actor.system.defence.Armour.value)
		const modifiedDamage = damage - armour

		if(modifiedDamage > 0) {
			console.log(`Aegean | ActorSheet::applyDamage => modifiedDamage=${modifiedDamage}`)

			this.addRisk(modifiedDamage)
		}
	}

	// roll a wound
	async applyWound(newWound) {
		// get the value of all current wounds and add to the new wound
		const totalWounds = (this.actor.system.attributes.Wounds.value || []).map(({ value }) => value).reduce(add, 0)

		console.log(`Aegean | ActorSheet::applyWound => newWound=${newWound}, totalWounds=${totalWounds}`)

		const wound = await woundRoll(totalWounds, newWound)

		this.actor.update({
			'system.attributes.Wounds.value': [ ...this.actor.system.attributes.Wounds.value, wound]
		})
	}

	setRisk(newRisk) {
		console.log(`Aegean | ActorSheet::setRisk => newRisk=${newRisk}`)

		const flags = this.actor.getDerivedData()
		const currentRisk = parseInt(this.actor.system.attributes.Risk.value)

		if(flags.vulnerable && newRisk > currentRisk) {
			this.applyWound(newRisk - currentRisk)
		}
		else {
			this.actor.update({
				'system.attributes.Risk.value': newRisk
			})

			// if character is now vulnerable apply a 1 point Wound
			if(newRisk > flags.endurance) {
				console.log('Aegean | ActorSheet::addRisk => NOW VULNERABLE apply 1 point wound')

				this.applyWound(1)
			}
		}
	}

	// set Risk to the given value and apply a wound if this makes the character vulnerable
	addRisk(riskToAdd) {
		const flags = this.actor.getDerivedData()

		// if the character is vulnerable, roll a wound instead
		if(flags.vulnerable) {
			console.log('Aegean | ActorSheet::addRisk => VULNERABLE')

			this.applyWound(riskToAdd)
		}
		else {
			const newRisk = parseInt(this.actor.system.attributes.Risk.value) + riskToAdd

			console.log(`Aegean | ActorSheet::addRisk => newRisk=${newRisk}`)

			this.actor.update({
				'system.attributes.Risk.value': newRisk
			})

			// if character is now vulnerable apply a 1 point Wound
			if(newRisk > flags.endurance) {
				console.log('Aegean | ActorSheet::addRisk => NOW VULNERABLE apply 1 point wound')

				this.applyWound(1)
			}
		}
	}
}
