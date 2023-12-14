
import { AegeanItemSheet } from '../item-sheet.js'

export class AegeanEquipmentSheet extends AegeanItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'equipment'],
			template: 'systems/aegean/templates/item/equipment-sheet.html',
			width: 520,
			height: 480,
			tabs: [{
				navSelector: '.tab-group',
				contentSelector: '.tab-panel',
				initial: 'equipment_equipment',
			}],
		})
	}
}
