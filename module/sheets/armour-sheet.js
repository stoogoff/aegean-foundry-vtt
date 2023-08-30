
import { AegeanItemSheet } from './item-sheet.js'

export class AegeanArmourSheet extends AegeanItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'armour'],
			template: 'systems/aegean/templates/item/armour-sheet.html',
			width: 520,
			height: 520,
			tabs: [],
		})
	}
}
