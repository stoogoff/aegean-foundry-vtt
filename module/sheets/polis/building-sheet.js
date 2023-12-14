
import { AegeanItemSheet } from '../item-sheet.js'

export class AegeanBuildingSheet extends AegeanItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'building'],
			template: 'systems/aegean/templates/item/building-sheet.html',
			width: 520,
			height: 480,
			tabs: [{
				navSelector: '.tab-group',
				contentSelector: '.tab-panel',
				initial: 'building_stats',
			}],
		})
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

		console.log('Aegean | BuildingSheet::_addListValue => addId, value', addId, value)

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

		console.log('Aegean | BuildingSheet::_updateListValue => attribute, value', attribute, value)

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

		console.log('Aegean | BuildingSheet::_deleteListValue => deleteId', deleteId)

		const parts = deleteId.replace('building_', '').split('_')
		const index = parts.pop()
		const key = parts.join('.')

		const currentValue = this.item.getValueFromKey(key)

		currentValue.splice(index, 1)

		this.item.update({
			[key]: currentValue
		})
	}
}
