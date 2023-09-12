
import { add } from '../helpers/list.js'
import { roll } from '../helpers/dice-roller.js'

export class SkillCheck extends Dialog {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'dialog'],
			width: 400,
			height: 340,
		})
	}

	static async show(context, selection) {
		const content = await renderTemplate('systems/aegean/templates/dialogs/skill-check.html', context)
		const dialog = new SkillCheck({
			title: game.i18n.localize('aegean.system.SkillCheck'),
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

						const difficulty = html.find('[data-difficulty]').attr('data-difficulty')

						// dice syntax: /roll 5d10cs>=8
						const result = await roll(dice, difficulty)

						// send results to chat
						const content = await renderTemplate('systems/aegean/templates/messages/skill-check.html', {
							dice: result,
							difficulty,
							characteristic: html.find('[name=characteristic]').val(),
							skill: html.find('[name=skill]').val(),
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
		}, context, selection || {})

		dialog.render(true)
	}

	constructor(data, context, selection) {
		super(data, context)

		this.context = context
		this.selection = selection

		console.log('Aegean | RollDialog::constructor => context, selection', context, selection)
	}

	activateListeners(html) {
		super.activateListeners(html)

		html.find('.value-select:not(#specialisation)').change(this._updateFromContext.bind(this))
		html.find('.value-text').change(this._updateFromValue('data-value').bind(this))
		html.find('.difficulty-select').change(this._updateFromValue('data-difficulty').bind(this))
		html.find('#specialisation').change(this._applySpec.bind(this))

		// prefill any existing values
		const keys = ['characteristic', 'skill', 'difficulty', 'modifier']

		keys.forEach(key => {
			if(key in this.selection) {
				const value = this.selection[key]
				const target = html.find(`[name=${key}]`).val(value)
				const isDifficulty = key === 'difficulty'
				const numericValue = isDifficulty || key === 'modifier' ? this.selection[key] : this.context[`${key}s`][value].value

				this._setDiceValue(
					target,
					key,
					numericValue,
					isDifficulty ? 'data-difficulty' : 'data-value',
					isDifficulty ? '' : 'D'
				)
			}
		})

		this._updateSpecList()
	}

	_setDiceValue(target, key, dice, attr, suffix = '') {
		target.parent().find(`#${key}_value`).text(`${dice}${suffix}`).attr(attr, dice)
	}

	_applySpec(event) {
		const target = $(event.currentTarget)
		const key = target.attr('name')
		const value = target.val()
		const dice = value === '' ? 0 : 1

		console.log(`Aegean | RollDialog::_applySpec => key=${key}, value=${value}, dice=${dice}`)

		this._setDiceValue(target, key, dice, 'data-value', 'D')
	}

	_updateFromContext(event) {
		const target = $(event.currentTarget)
		const key = target.attr('name')
		const value = target.val()
		const dice = this.context[`${key}s`][value].value

		console.log(`Aegean | RollDialog::_updateFromContext => key=${key}, value=${value}, dice=${dice}`)

		this._setDiceValue(target, key, dice, 'data-value', 'D')

		if(key === 'skill') this._updateSpecList()
	}

	_updateFromValue(attr) {
		return event => {
			const target = $(event.currentTarget)
			const key = target.attr('name')
			const dice = target.val()

			console.log(`Aegean | RollDialog::_updateFromValue => key=${key}, dice=${dice}`)

			this._setDiceValue(target, key, dice, attr)
		}
	}

	_updateSpecList() {
		const selectedSkill = $('#skill').val()

		if(selectedSkill in this.context.specialisations.value) {
			const specs = this.context.specialisations.value[selectedSkill]

			$('#specialisation').empty().append($('<option />'))

			specs.forEach(spec => $('#specialisation').append($('<option></option>', {
				text: spec,
				value: spec,
			})))

			$('#specialisation_block').show()
		}
		else {
			$('#specialisation_block').hide()
		}
	}
}
