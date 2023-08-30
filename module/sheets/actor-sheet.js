
import { AEGEAN } from '../helpers/config.js'

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

		//context.actor = this.actor.toObject()
		//context.actor.id = context.actor.id ?? context.actor._id

		console.log('Aegean | ActorSheet::getData', context)

		const actor = this.actor.toObject(false)

		context.system = actor.system
		context.talents = actor.items.filter(item => item.type === 'talent')
		context.armour = actor.items.filter(item => item.type === 'armour')
		context.weapons = actor.items.filter(item => item.type === 'weapon')
		context.equipment = [
			...actor.items.filter(item => item.type === 'equipment'),
			...context.armour,
			...context.weapons,
		]
		context.config = AEGEAN

		return context
	}

	/*activateListeners(html) {
		console.log('Aegean | activateListeners', html)
		super.activateListeners(html)
	}*/

	async _onDrop(event, data) {
		let dragData = JSON.parse(event.dataTransfer.getData("text/plain"));

		console.log('Aegean | onDrop::dragData', { ...dragData })
		console.log('Aegean | onDrop::event', { ...event })
		console.log('Aegean | onDrop::data', { ...data })

		// TODO prevent dropping properties on a character

		/*if (dragData.type === "itemDrop") {
			this.actor.createEmbeddedDocuments("Item", [dragData.item]);
		} else {
			super._onDrop(event, data);
		}*/

		super._onDrop(event, data)
	}
}
