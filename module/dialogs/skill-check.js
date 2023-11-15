
import BaseRoll, { calculateResultAndSendToChat } from './base-roll.js'

export class SkillCheck extends BaseRoll {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'dialog'],
			width: 400,
			height: 340,
		})
	}

	static async show(context, selection, callback) {
		const content = await renderTemplate('systems/aegean/templates/dialogs/skill-check.html', context)
		const dialog = new SkillCheck({
			title: game.i18n.localize('aegean.system.SkillCheck'),
			content,
			buttons: {
				roll: {
					icon: '<i class="fas fa-dice-d10"></i>',
					label: game.i18n.localize('aegean.ui.Roll'),
					callback: async html => {
						const result = await calculateResultAndSendToChat(html, context, 'aegean.system.SkillCheck')

						if(callback) callback(result.successes)
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

		console.log('Aegean | SkillCheck::constructor => context, selection', context, selection)
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
					isDifficulty ? 'data-difficulty' : 'data-value'
				)
			}
		})

		this._updateSpecList()
	}

	_updateFromContext(event) {
		const target = $(event.currentTarget)
		const key = target.attr('name')
		const value = target.val()
		const dice = this.context[`${key}s`][value].value

		console.log(`Aegean | SkillCheck::_updateFromContext => key=${key}, value=${value}, dice=${dice}`)

		this._setDiceValue(target, key, dice, 'data-value', 'D')

		if(key === 'skill') this._updateSpecList()
	}
}
