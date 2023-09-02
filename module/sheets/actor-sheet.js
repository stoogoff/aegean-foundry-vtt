
import { AEGEAN } from '../helpers/config.js'
import { sortByProperty } from '../helpers/list.js'

export class AegeanActorSheet extends ActorSheet {
	/** @override */
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
		context.advantages = this.actor.advantages
		context.armour = this.actor.armour
		context.deities = game.items.filter(item => item.type === 'deity' && item.system.stats.Parent.value).map(({ name }) => name)
		context.equipment = this.actor.equipment.sort(sortByProperty('name'))
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
		html.find('.delete-equipment').click(this._deleteItem.bind(this))
		html.find('.delete-talent').click(this._deleteItem.bind(this))
		html.find('.delete-adv').click(this._deleteItem.bind(this))

		// enable accordions
		html.find('.accordion-activator').click(event => {
			$(event.currentTarget).closest('.accordion').toggleClass('active')
		})

		// enable updating ratings for talents
		html.find('.rating-input').change(this._updateRating.bind(this))
	}

	_deleteItem(event) {
		const deleteId = $(event.currentTarget).attr('data-id')

		this.actor.deleteEmbeddedDocuments('Item', [ deleteId ])
	}

	_updateRating(event) {
		const target = $(event.currentTarget)
		const talentId = target.attr('data-id')
		const key = target.attr('name')
		const value = target.val()
		const talent = this.actor.talents.find(talent => talent.id === talentId)

		talent.update({
			[key]: value
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
