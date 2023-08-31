
import { AEGEAN } from '../helpers/config.js'
import { sortByProperty } from '../helpers/list.js'

export class AegeanActorSheet extends ActorSheet {
	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'actor'],
			template: 'systems/aegean/templates/actor/actor-character-sheet.html',
			width: 800,
			height: 600
		})
	}

	/** @override */
	get template() {
		return `systems/aegean/templates/actor/actor-${this.actor.type}-sheet.html`
	}

	/* -------------------------------------------- */

	/** @override */
	getData() {
		const context = super.getData()
		const actor = this.actor.toObject(false)

		context.config = AEGEAN
		context.system = actor.system
		context.talents = this.actor.talents
		context.armour = this.actor.armour
		context.weapons = this.actor.weapons
		context.equipment = this.actor.equipment.sort(sortByProperty('name'))

		console.log('Aegean | ActorSheet::getData', context)

		return context
	}

	activateListeners(html) {
		super.activateListeners(html)
	
		if (!this.isEditable) return

		// enable delete actions
		html.find('.delete-equipment').click(this._deleteItem.bind(this))
		html.find('.delete-talent').click(this._deleteItem.bind(this))
	}

	_deleteItem(event) {
		const deleteId = $(event.currentTarget).attr('data-id')

		this.actor.deleteEmbeddedDocuments('Item', [ deleteId ])
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
