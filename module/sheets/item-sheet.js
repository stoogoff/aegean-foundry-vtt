
import { AEGEAN } from '../helpers/config.js'
import { canHaveProperties } from '../helpers/utils.js'

export class AegeanItemSheet extends ItemSheet {
	async getData() {
		const context = super.getData();
		const item = this.item.toObject(false)

		context.config = AEGEAN
		context.system = item.system
		context.properties = this.item.properties
		context.editable = this.isEditable

		console.log(context.editable)

		if(context.system.Description) context.system.Description.value = await TextEditor.enrichHTML(context.system.Description.value, { async: true })

		console.log('Aegean | ItemSheet::getData', context)

		return context;
	}

	activateListeners(html) {
		super.activateListeners(html)

		if (!this.isEditable) return

		// enable drag drop for items
		html.on('drop', this._onDrop.bind(this))

		// enable delete actions
		html.find('.delete-property').click(this._deleteProperty.bind(this))

		// enable updating ratings for equipment properties
		html.find('.rating-input').change(this._updateRating.bind(this))

		// enable checkboxes as having them in tabs breaks them for some reason
		html.find('input[type=checkbox]').click(event => {
			const key = $(event.currentTarget).attr('name')
			const checked = $(event.currentTarget).is(':checked')

			this.item.update({
				[key]: checked
			})
		})
	}

	_deleteProperty(event) {
		const deleteId = $(event.currentTarget).attr('data-id')

		console.log('Aegean | ItemSheet::_deleteProperty => deleteId', deleteId)

		const updatedProperties = this.item.system.equipment.Properties.value.filter(({ id }) => id !== deleteId)

		this.item.update({
			'system.equipment.Properties.value': updatedProperties
		})
	}

	_updateRating(event) {
		const updateId = $(event.currentTarget).attr('data-id')
		const updatedValue = $(event.currentTarget).val()

		console.log('Aegean | ItemSheet::_updateRating => updateId, updatedValue', updateId, updatedValue)

		const updatedProperty = this.item.system.equipment.Properties.value.find(({ id }) => id === updateId)

		updatedProperty.rating = updatedValue

		this.item.update({
			'system.equipment.Properties.value': this.item.system.equipment.Properties.value
		})
	}

	async _onDrop(event, data) {
		if(!event.originalEvent) return
		if(!event.originalEvent.dataTransfer) return

		let dragData = JSON.parse(event.originalEvent.dataTransfer.getData('text/plain'))

		console.log('Aegean | ItemSheet::_onDrop => dragData', dragData)

		if(!dragData.uuid.startsWith('Item.')) return

		// load the item by uuid (remove the Item prefix)
		const dragItem = game.items.get(dragData.uuid.replace('Item.', ''))

		console.log('Aegean | ItemSheet::_onDrop => dragItem', dragItem)

		if(canHaveProperties(this.item.type) && dragItem.type === 'property') {
			const currentProperties = this.item.system.equipment.Properties.value
			const existing = currentProperties.find(property => property.id === dragItem.id)

			// the property already exists
			if(existing) {
				// it's not ranked so don't add it
				if(dragItem.system.stats.Ranked.value !== true) return

				// increase the rank and update
				existing.rating++

				this.item.update({
					'system.equipment.Properties.value': [ ...currentProperties ]
				})
			}
			else {
				this.item.update({
					'system.equipment.Properties.value': [ ...currentProperties, { id: dragItem.id, rating: 1 } ]
				})
			}
		}
	}
}
