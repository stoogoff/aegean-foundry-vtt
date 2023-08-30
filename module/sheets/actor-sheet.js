
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

		console.log('Aegean | ActorSheet::getData', context)

		const actor = this.actor.toObject(false)

		context.system = actor.system
		context.talents = this.actor.talents
		context.armour = this.actor.armour
		context.weapons = this.actor.weapons
		context.equipment = this.actor.equipment.sort(sortByProperty('name'))
		context.config = AEGEAN

		return context
	}

	/*activateListeners(html) {
		console.log('Aegean | activateListeners', html)
		super.activateListeners(html)
	}*/

	// prevent dropping actors onto each other
	async _onDropActor() {}

	async _onDropItem(event, data) {
		let dragData = JSON.parse(event.dataTransfer.getData('text/plain'))

		// load the item by uuid (remove the Item prefix)
		const dragItem = game.items.get(dragData.uuid.replace('Item.', ''))

		console.log('Aegean | ActorSheet::_onDropItem => dragData', dragData)
		console.log('Aegean | ActorSheet::_onDropItem => dragItem', dragItem)

		if(!dragItem) return

		switch(dragItem.type) {
			// properties can't be dropped on a character
			case 'property':
				return

			// talents can only be dropped on a character once,
			// unless they're ranked or multiple
			case 'talent':
				console.log(this.actor.talents)

				if(!dragItem.system.stats.Ranked.value && !dragItem.system.stats.Multiple.value) {
					const existing = this.actor.talents.find(talent => talent.flags.core.sourceId === dragData.uuid)

					if(existing) return
				}
		}

		super._onDropItem(event, data)
	}
}
