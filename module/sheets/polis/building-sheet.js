
import { AegeanPolisBaseSheet } from './polis-base.js'

export class AegeanBuildingSheet extends AegeanPolisBaseSheet {
	template_key = 'building_'

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
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
}
