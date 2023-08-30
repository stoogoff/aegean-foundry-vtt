
import { AEGEAN } from '../helpers/config.js'
import { isEquipment } from '../helpers/utils.js'

export class AegeanItemSheet extends ItemSheet {
	async getData() {
		const context = super.getData();

		context.system = this.item.toObject(false).system
		context.system.Description.value = await TextEditor.enrichHTML(context.system.Description.value, { async: true });
		context.config = AEGEAN

		console.log('Aegean | ItemSheet::getData', context)

		/*// Use a safe clone of the item data for further operations.
		const itemData = context.item.data;

		// Retrieve the roll data for TinyMCE editors.
		context.rollData = {};
		let actor = this.object?.parent ?? null;
		if (actor) {
			context.rollData = actor.getRollData();
		}

		// Add the actor's data to context.data for easier access, as well as flags.
		context.data = itemData.data;
		context.flags = itemData.flags;*/

		return context;
	}

	activateListeners(html) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		// Roll handlers, click handlers, etc. would go here.
	}

	// THIS DOESN'T SEEM TO FIRE!
	async _onDrop(event, data) {
		let dragData = JSON.parse(event.dataTransfer.getData('text/plain'))

		// load the item by uuid (remove the Item prefix)
		const dragItem = game.items.get(dragData.uuid.replace('Item.', ''))

		console.log('Aegean | ItemSheet::_onDropItem => dragData', dragData)
		console.log('Aegean | ItemSheet::_onDropItem => dragItem', dragItem)

		console.log(this.item.type)

		if(isEquipment(this.item.type)) {

		}
	}
}
