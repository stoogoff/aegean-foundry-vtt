
import { AegeanPolisBaseSheet } from './polis-base.js'

export class AegeanRetainerSheet extends AegeanPolisBaseSheet {
	template_key = 'retainer_'

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'retainer'],
			template: 'systems/aegean/templates/item/retainer-sheet.html',
			width: 520,
			height: 480,
			tabs: [{
				navSelector: '.tab-group',
				contentSelector: '.tab-panel',
				initial: 'retainer_stats',
			}],
		})
	}
}
