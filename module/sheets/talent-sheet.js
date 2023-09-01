
import { AegeanItemSheet } from './item-sheet.js'

export class AegeanTalentSheet extends AegeanItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'talent'],
			template: 'systems/aegean/templates/item/talent-sheet.html',
			width: 520,
			height: 480,
			tabs: [{
				navSelector: '.tab-group',
				contentSelector: '.tab-panel',
				initial: 'talent_talent',
			}],
		})
	}
}
