
import { AegeanItemSheet } from '../item-sheet.js'

export class AegeanPolisBaseSheet extends AegeanItemSheet {
	async getData() {
		const context = await super.getData();
		const item = this.item.toObject(false)

		context.requires = this.item.system.stats.Requires.value.map(item => ({ ...game.items.get(item.id) }))

		console.log('Aegean | PolisBase::getData', context)

		return context;
	}

	activateListeners(html) {
		super.activateListeners(html)

		if (!this.isEditable) return

		html.find('.add-multi-select').not('.disabled').click(this._addListValue.bind(this))
		html.find('.delete-multi-select').click(this._deleteListValue.bind(this))
		html.find('.editable-input').change(this._updateListValue.bind(this))
	}

	_addListValue(event) {
		const addId = $(event.currentTarget).attr('data-id')
		const value = $(`#${addId}`).val()

		console.log('Aegean | PolisBase::_addListValue => addId, value', addId, value)

		const key = addId.replace('building_', '').replace(/_/g, '.')
		const currentValue = this.item.getValueFromKey(key)

		if(!currentValue.map(val => val.text).includes(value)) {
			this.item.update({
				[key]: [ ...currentValue, { text: value, value: 1 } ]
			})
		}
	}

	_updateListValue(event) {
		const currentTarget = $(event.currentTarget)
		const value = currentTarget.val()
		const attribute = currentTarget.attr('name')

		console.log('Aegean | PolisBase::_updateListValue => attribute, value', attribute, value)

		const parts = attribute.replace('building_', '').split('_')
		const index = parseInt(parts.pop())

		const key = parts.join('.')
		const currentValue = this.item.getValueFromKey(key)

		currentValue[index].value = value

		this.item.update({
			[key]: currentValue
		})
	}

	_deleteListValue(event) {
		const deleteId = $(event.currentTarget).attr('data-id')

		console.log('Aegean | PolisBase::_deleteListValue => deleteId', deleteId)

		const parts = deleteId.replace('building_', '').split('_')
		const index = parts.pop()
		const key = parts.join('.')

		const currentValue = this.item.getValueFromKey(key)

		currentValue.splice(index, 1)

		this.item.update({
			[key]: currentValue
		})
	}

	async _onDrop(event, data) {
		if(!event.originalEvent) return
		if(!event.originalEvent.dataTransfer) return

		let dragData = JSON.parse(event.originalEvent.dataTransfer.getData('text/plain'))

		console.log('Aegean | PolisBase::_onDrop => dragData', dragData)

		if(!dragData.uuid.startsWith('Item.')) return

		// load the item by uuid (remove the Item prefix)
		const dragItem = game.items.get(dragData.uuid.replace('Item.', ''))

		console.log('Aegean | PolisBase::_onDrop => dragItem', dragItem)

		if(dragItem.type === 'building') {
			const currentItems = this.item.system.stats.Requires.value
			const existing = currentItems.find(item => item.id === dragItem.id)

			// the item already exists
			if(existing) {
				return
			}
			else {
				this.item.update({
					'system.stats.Requires.value': [ ...currentItems, { id: dragItem.id, rating: 1 } ]
				})
			}
		}
	}
}
