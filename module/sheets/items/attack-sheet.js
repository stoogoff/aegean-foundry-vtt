
import { AegeanItemSheet } from '../item-sheet.js'

export class AegeanAttackSheet extends AegeanItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'attack'],
			template: 'systems/aegean/templates/item/attack-sheet.html',
			width: 520,
			height: 480,
			tabs: [{
				navSelector: '.tab-group',
				contentSelector: '.tab-panel',
				initial: 'attack_attack',
			}],
		})
	}
}
