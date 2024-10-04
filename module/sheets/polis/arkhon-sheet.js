
import { AegeanPolisBaseSheet } from './polis-base.js'

export class AegeanArkhonSheet extends AegeanPolisBaseSheet {
	template_key = 'arkhon_'

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'arkhon'],
			template: 'systems/aegean/templates/item/arkhon-sheet.html',
			width: 520,
			height: 480,
			tabs: [{
				navSelector: '.tab-group',
				contentSelector: '.tab-panel',
				initial: 'arkhon_skills',
			}],
		})
	}

	_canAdd(itemType) {
		return false
	}
}
