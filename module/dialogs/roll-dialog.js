
import { add } from '../helpers/list.js'

export class RollDialog extends Dialog {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'dialog'],
			width: 400,
			height: 300,
		})
	}

	static async show(context) {
		const content = await renderTemplate('systems/aegean/templates/app/roll-dialog.html', context)
		const dialog = new RollDialog({
			title: game.i18n.localize('aegean.system.SkillCheck'),
			content: content,
			buttons: {
				roll: {
					icon: '<i class="fas fa-dice-d10"></i>',
					label: game.i18n.localize('aegean.ui.Roll'),
					callback: html => {
						const dice = html.find('[data-value]').map(function() {
							return parseInt($(this).attr('data-value'))
						}).get().reduce(add, 0)

						console.log(dice)
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
		html.find('.value-text').change(this._updateFromValue.bind(this))
	}

	_updateFromContext(event) {
		const target = $(event.currentTarget)
		const key = target.attr('name')
		const value = target.val()
		const dice = this.context[key][value].value

		console.log(`Aegean | RollDialog::_updateFromContext => key=${key}, value=${value}, dice=${dice}`)

		target.parent().find(`#${key}_value`).text(`${dice}D`).attr('data-value', dice)
	}

	_updateFromValue(event) {
		const target = $(event.currentTarget)
		const key = target.attr('name')
		const dice = target.val()

		console.log(`Aegean | RollDialog::_updateFromValue => key=${key}, dice=${dice}`)

		target.parent().find(`#${key}_value`).text(`${dice}D`).attr('data-value', dice)
	}
}
