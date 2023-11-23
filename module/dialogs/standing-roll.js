
import { sortByProperty } from '../helpers/list.js'
import { isPC } from '../helpers/utils.js'
import { roll } from '../helpers/dice-roller.js'
import BaseRoll, { calculateResultAndSendToChat } from './base-roll.js'

export class StandingRoll extends BaseRoll {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'dialog'],
			width: 400,
			height: 220,
		})
	}

	static async show(context, callback) {
		const content = await renderTemplate('systems/aegean/templates/dialogs/standing-roll.html', context)
		const dialog = new StandingRoll({
			title: game.i18n.localize('aegean.ui.StandingRoll'),
			content,
			buttons: {
				roll: {
					icon: '<i class="fas fa-dice-d10"></i>',
					label: game.i18n.localize('aegean.ui.Roll'),
					callback: async html => {
						const result = await calculateResultAndSendToChat(html, context, 'aegean.ui.StandingRoll')

						if(callback) callback(result.successes)
					},
				},
			},
			default: 'roll',
			close: () => {},
		}, context)

		dialog.render(true)
	}

	constructor(data, context) {
		super(data, context)

		this.context = context

		console.log('Aegean | StandingRoll::constructor => context', context)
	}

	activateListeners(html) {
		super.activateListeners(html)

		html.find('.value-text').change(this._updateFromValue().bind(this))
		html.find('.difficulty-select').change(this._updateFromValue('data-difficulty').bind(this))

		const standing = this.context.attributes.Standing

		html.find('#standing').val(standing.value)
		html.find('#standing_value').attr('data-value', standing.value).text(standing.value)
	}
}
