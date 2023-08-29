
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

		context.system = this.actor.toObject(false).system
		context.config = AEGEAN

		return context
	}

	/*activateListeners(html) {
		console.log('Aegean | activateListeners', html)
		super.activateListeners(html)
	}*/
}
