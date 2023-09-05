
import { add } from '../helpers/list.js'
import { roll } from '../helpers/dice-roller.js'

export class SkillCheck extends Dialog {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'dialog'],
			width: 400,
			height: 300,
		})
	}

	static async show(context) {
		const content = await renderTemplate('systems/aegean/templates/dialogs/skill-check.html', context)
		const dialog = new SkillCheck({
			title: game.i18n.localize('aegean.system.SkillCheck'),
			content,
			buttons: {
				roll: {
					icon: '<i class="fas fa-dice-d10"></i>',
					label: game.i18n.localize('aegean.ui.Roll'),
					callback: async html => {
						const dice = html.find('[data-value]').map(function() {
							return parseInt($(this).attr('data-value'))
						}).get().reduce(add, 0)

						const difficulty = html.find('[data-difficulty]').attr('data-difficulty')

						// dice syntax: /roll 5d10cs>=8
						const result = await roll(dice, difficulty)

						// send results to chat
						const content = await renderTemplate('systems/aegean/templates/messages/skill-check.html', {
							dice: result,
							difficulty,
							characteristic: html.find('[name=characteristics]').val(),
							skill: html.find('[name=skills]').val(),
						})

						ChatMessage.create({
							title: game.i18n.localize('aegean.system.SkillCheck'),
							content,
							speaker: ChatMessage.getSpeaker({ actor: context.actor }),
						})
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
	}

	activateListeners(html) {
		super.activateListeners(html)
		
		html.find('.value-select').change(this._updateFromContext.bind(this))
		html.find('.value-text').change(this._updateFromValue('data-value').bind(this))
		html.find('.difficulty-select').change(this._updateFromValue('data-difficulty').bind(this))
	}

	_updateFromContext(event) {
		const target = $(event.currentTarget)
		const key = target.attr('name')
		const value = target.val()
		const dice = this.context[key][value].value

		console.log(`Aegean | RollDialog::_updateFromContext => key=${key}, value=${value}, dice=${dice}`)

		target.parent().find(`#${key}_value`).text(`${dice}D`).attr('data-value', dice)
	}

	_updateFromValue(attr) {
		return event => {
			const target = $(event.currentTarget)
			const key = target.attr('name')
			const dice = target.val()

			console.log(`Aegean | RollDialog::_updateFromValue => key=${key}, dice=${dice}`)

			target.parent().find(`#${key}_value`).text(dice).attr(attr, dice)
		}
	}
}
