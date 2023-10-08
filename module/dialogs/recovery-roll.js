
import { sortByProperty } from '../helpers/list.js'
import { isPC } from '../helpers/utils.js'
import { roll } from '../helpers/dice-roller.js'
import BaseRoll, { calculateResultAndSendToChat } from './base-roll.js'

export class RecoveryRoll extends BaseRoll {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'dialog'],
			width: 400,
			height: 220,
		})
	}

	static async show(context, callback) {
		const content = await renderTemplate('systems/aegean/templates/dialogs/recovery-roll.html', context)
		const dialog = new RecoveryRoll({
			title: game.i18n.localize('aegean.ui.RecoveryRoll'),
			content,
			buttons: {
				roll: {
					icon: '<i class="fas fa-dice-d10"></i>',
					label: game.i18n.localize('aegean.ui.Roll'),
					callback: async html => {
						const result = await calculateResultAndSendToChat(html, context, 'aegean.ui.RecoveryRoll')

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

		console.log('Aegean | Recovery::constructor => context', context)
	}

	activateListeners(html) {
		super.activateListeners(html)

		html.find('.value-text').change(this._updateFromValue().bind(this))

		// get heighest characteristc
		const [ characteristic, ] = Object.values(this.context.characteristics).sort(sortByProperty('value')).reverse()
		const skill = this.context.skills.Vigour

		const hasRecovery = isPC(this.context.actor.type) && 'Vigour' in this.context.specialisations.value && this.context.specialisations.value.Vigour.find(val => val === 'Recovery') !== undefined

		const spec = hasRecovery ? ': Recovery' : ''
		const skillValue = parseInt(skill.value) + (hasRecovery ? 1 : 0)

		html.find('#characteristic').val(game.i18n.localize(characteristic.label))
		html.find('#characteristic_value').attr('data-value', characteristic.value).text(characteristic.value)

		html.find('#skill').val(game.i18n.localize(skill.label) + spec)
		html.find('#skill_value').attr('data-value', skillValue).text(skillValue)
	}
}
