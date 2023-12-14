
import { AegeanItemSheet } from '../item-sheet.js'

export class AegeanWeaponSheet extends AegeanItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'weapon'],
			template: 'systems/aegean/templates/item/weapon-sheet.html',
			width: 520,
			height: 480,
			tabs: [{
				navSelector: '.tab-group',
				contentSelector: '.tab-panel',
				initial: 'weapon_equipment',
			}],
		})
	}
}
