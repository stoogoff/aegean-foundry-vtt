
import { AegeanItemSheet } from './item-sheet.js'

export class AegeanCareerSheet extends AegeanItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'career'],
			template: 'systems/aegean/templates/item/career-sheet.html',
			width: 600,
			height: 500,
			tabs: [{
				navSelector: '.tab-group',
				contentSelector: '.tab-panel',
				initial: 'career_stats',
			}],
		})
	}

	async getData() {
		const context = await super.getData();

		if(context.system.notes.WorksWith) context.system.notes.WorksWith.value = await TextEditor.enrichHTML(context.system.notes.WorksWith.value, { async: true })
		if(context.system.notes.ChooseIf) context.system.notes.ChooseIf.value = await TextEditor.enrichHTML(context.system.notes.ChooseIf.value, { async: true })

		return context
	}

	activateListeners(html) {
		super.activateListeners(html)

		if(!this.isEditable) return

		html.find('.add-multi-select').not('.disabled').click(this._addListValue.bind(this))
		html.find('.delete-multi-select').click(this._deleteListValue.bind(this))
	}

	_addListValue(event) {
		const addId = $(event.currentTarget).attr('data-id')
		const value = $(`#${addId}`).val()

		console.log('Aegean | CareerSheet::_addListValue => addId, value', addId, value)

		const key = addId.replace(/_/g, '.')
		const currentValue = this.item.getValueFromKey(key)

		if(!currentValue.includes(value)) {
			this.item.update({
				[key]: [ ...currentValue, value ]
			})
		}
	}

	_deleteListValue(event) {
		const deleteId = $(event.currentTarget).attr('data-id')

		console.log('Aegean | CareerSheet::_deleteListValue => deleteId', deleteId)

		const parts = deleteId.split('_')
		const index = parts.pop()
		const key = parts.join('.')

		const currentValue = this.item.getValueFromKey(key)

		currentValue.splice(index, 1)

		this.item.update({
			[key]: currentValue
		})
	}
}
