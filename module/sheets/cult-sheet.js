
import { AegeanTalentTrackSheet } from './talent-track-sheet.js'

export class AegeanCultSheet extends AegeanTalentTrackSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'cult'],
			template: 'systems/aegean/templates/item/cult-sheet.html',
			width: 600,
			height: 500,
			tabs: [{
				navSelector: '.tab-group',
				contentSelector: '.tab-panel',
				initial: 'cult_notes',
			}],
		})
	}

	async getData() {
		const context = await super.getData();

		// set up rich text
		if(context.system.notes.Initiation) context.system.notes.Initiation.value = await TextEditor.enrichHTML(context.system.notes.Initiation.value, { async: true })

		return context
	}
}
