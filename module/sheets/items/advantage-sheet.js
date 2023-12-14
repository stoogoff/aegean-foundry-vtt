
import { AegeanItemSheet } from '../item-sheet.js'

export class AegeanAdvantageSheet extends AegeanItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'advantage'],
			template: 'systems/aegean/templates/item/advantage-sheet.html',
			width: 520,
			height: 480,
			tabs: [],
		})
	}
}
