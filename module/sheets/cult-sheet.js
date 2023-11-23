
import { AegeanItemSheet } from './item-sheet.js'

export class AegeanCultSheet extends AegeanItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'cult'],
			template: 'systems/aegean/templates/item/cult-sheet.html',
			width: 600,
			height: 500,
		})
	}
}
