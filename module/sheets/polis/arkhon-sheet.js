
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

	get _currentDragItems() {
		return this.item.system.stats.Abilities.value
	}

	get _dropItemsProperty() {
		return 'system.stats.Abilities.value'
	}

	_canAdd(itemType) {
		return itemType === 'talent'
	}
}
