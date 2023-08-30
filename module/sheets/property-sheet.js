
import { AegeanItemSheet } from './item-sheet.js'

export class AegeanPropertySheet extends AegeanItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'property'],
			template: 'systems/aegean/templates/item/property-sheet.html',
			width: 520,
			height: 480,
			tabs: [],
		})
	}
}
