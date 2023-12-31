
import { AEGEAN } from '../helpers/config.js'
import { isPC } from '../helpers/utils.js'
import { sortByProperty } from '../helpers/list.js'
import BaseRoll, { calculateResultAndSendToChat } from './base-roll.js'

export class AttackRoll extends BaseRoll {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'dialog'],
			width: 400,
			height: 300,
		})
	}

	static async show(context, selection, callback) {
		const content = await renderTemplate('systems/aegean/templates/dialogs/attack-roll.html', context)
		const dialog = new AttackRoll({
			title: game.i18n.localize('aegean.ui.AttackRoll'),
			content,
			buttons: {
				roll: {
					icon: '<i class="fas fa-dice-d10"></i>',
					label: game.i18n.localize('aegean.ui.Roll'),
					callback: async html => {
						const result = await calculateResultAndSendToChat(html, context, 'aegean.ui.AttackRoll', selection)

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

		console.log('Aegean | Attack::constructor => context, selection', context, selection)
	}

	activateListeners(html) {
		super.activateListeners(html)

		html.find('.value-text').change(this._updateFromValue().bind(this))
		html.find('.difficulty-select').change(this._updateFromValue('data-difficulty').bind(this))

		let characteristicName = 'Might'
		const weapon = this.selection.weapon

		// find any properties with names that match characteristics
		const weaponCharacteristics = weapon.properties.filter(({ property }) => AEGEAN.characteristics.includes(property.name))

		console.log('Aegean | Attack::activateListeners => weaponCharacteristics', weaponCharacteristics)

		// if a characteristic property exists use it if its value is greater than the character's Might
		if(weaponCharacteristics.length > 0) {
			characteristicName = [ 'Might', ...weaponCharacteristics.map(wc => wc.property.name) ]
				.map(c => ({ name: c, value: this.context.characteristics[c].value }))
				.sort(sortByProperty('value'))
				.reverse()[0].name
		}

		const characteristic = this.context.characteristics[characteristicName]
		const skill = this.context.skills[weapon.system.stats.Skill.value]
		const skillValue = parseInt(skill.value)

		// prefill modifier
		if('modifier' in this.selection) {
			const value = this.selection.modifier
			const target = html.find('[name=modifier]').val(value)

			this._setDiceValue(target, 'modifier', value, 'data-value')
		}

		html.find('#characteristic').val(game.i18n.localize(characteristic.label))
		html.find('#characteristic_value').attr('data-value', characteristic.value).text(characteristic.value)

		html.find('#skill').val(game.i18n.localize(skill.label))
		html.find('#skill_value').attr('data-value', skillValue).text(skillValue)

		if(isPC(this.context.actor.type)) {
			html.find('#specialisation').change(this._applySpec.bind(this))

			this._updateSpecList()
		}
	}
}
