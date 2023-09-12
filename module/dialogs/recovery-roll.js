
import { add, max, sortByProperty } from '../helpers/list.js'
import { roll } from '../helpers/dice-roller.js'

export class RecoveryRoll extends Dialog {
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
						let dice = html.find('[data-value]').map(function() {
							return parseInt($(this).attr('data-value'))
						}).get().reduce(add, 0)

						if(context.flags.vulnerable) ++dice

						// dice syntax: /roll 5d10cs>=8
						const result = await roll(dice, 0)

						// send results to chat
						const content = await renderTemplate('systems/aegean/templates/messages/skill-check.html', {
							title: "aegean.ui.RecoveryRoll",
							dice: result,
							difficulty: 0,
							characteristic: html.find('[name=characteristic]').val(),
							skill: html.find('[name=skill]').val(),
						})

						ChatMessage.create({
							title: game.i18n.localize('aegean.ui.RecoveryRoll'),
							content,
							speaker: ChatMessage.getSpeaker({ actor: context.actor }),
						})

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

		html.find('.value-text').change(this._updateFromValue.bind(this))

		// get heighest characteristc
		const [ characteristic, ] = Object.values(this.context.characteristics).sort(sortByProperty('value')).reverse()
		const skill = this.context.skills.Vigour

		const hasRecovery = 'Vigour' in this.context.specialisations.value && this.context.specialisations.value.Vigour.find(val => val === 'Recovery') !== undefined

		const spec = hasRecovery ? ': Recovery' : ''
		const skillValue = parseInt(skill.value) + (hasRecovery ? 1 : 0)

		html.find('#characteristic').val(game.i18n.localize(characteristic.label))
		html.find('#characteristic_value').attr('data-value', characteristic.value).text(characteristic.value)

		html.find('#skill').val(game.i18n.localize(skill.label) + spec)
		html.find('#skill_value').attr('data-value', skillValue).text(skillValue)
	}

	_setDiceValue(target, key, dice, attr, suffix = '') {
		target.parent().find(`#${key}_value`).text(`${dice}${suffix}`).attr(attr, dice)
	}

	_updateFromValue(event) {
		const target = $(event.currentTarget)
		const key = target.attr('name')
		const dice = target.val()

		console.log(`Aegean | Recovery::_updateFromValue => key=${key}, dice=${dice}`)

		this._setDiceValue(target, key, dice, 'data-value')
	}
}
