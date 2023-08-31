
import { AEGEAN } from '../helpers/config.js'
import { isEquipment } from '../helpers/utils.js'

export class AegeanItemSheet extends ItemSheet {
	async getData() {
		const context = super.getData();
		const item = this.item.toObject(false)

		console.log(item)

		context.system = item.system
		context.system.Description.value = await TextEditor.enrichHTML(context.system.Description.value, { async: true })

		if(isEquipment(item.type)) {
			context.properties = item.system.equipment.Properties.value || []
		}

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
		super.activateListeners(html)

		if (!this.isEditable) return

		// enable drag drop for items
		html.on('drop', this._onDrop.bind(this))
	}

	async _onDrop(event, data) {
		let dragData = JSON.parse(event.originalEvent.dataTransfer.getData('text/plain'))

		console.log('Aegean | ItemSheet::_onDrop => dragData', dragData)

		if(!dragData.uuid.startsWith('Item.')) return

		// load the item by uuid (remove the Item prefix)
		const dragItem = game.items.get(dragData.uuid.replace('Item.', ''))

		console.log('Aegean | ItemSheet::_onDrop => dragItem', dragItem)

		if(isEquipment(this.item.type) && dragItem.type === 'property') {
			// TODO if the property exists don't add it unless...
			// TODO the property is ranked, in which case increase its rank

			this.item.update({
				'system.equipment.Properties.value': [ dragItem ]
			})
		}
	}
}
