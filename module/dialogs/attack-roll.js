
import { AEGEAN } from '../helpers/config.js'
import { isPC } from '../helpers/utils.js'
import BaseRoll, { calculateResultAndSendToChat } from './base-roll.js'

export class AttackRoll extends BaseRoll {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'dialog'],
			width: 400,
			height: 300,
		})
	}

	static async show(context, callback) {
		const content = await renderTemplate('systems/aegean/templates/dialogs/attack-roll.html', context)
		const dialog = new AttackRoll({
			title: game.i18n.localize('aegean.ui.AttackRoll'),
			content,
			buttons: {
				roll: {
					icon: '<i class="fas fa-dice-d10"></i>',
					label: game.i18n.localize('aegean.ui.Roll'),
					callback: async html => {
						const result = await calculateResultAndSendToChat(html, context, 'aegean.ui.AttackRoll')

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

		console.log('Aegean | Attack::constructor => context', context)
	}

	activateListeners(html) {
		super.activateListeners(html)

		html.find('.value-text').change(this._updateFromValue().bind(this))

		let characteristicName = 'Might'
		const weapon = this.context.weapon

		// find any properties with names that match characteristics
		const weaponCharacteristic = weapon.properties.find(({ property }) => AEGEAN.characteristics.includes(property.name))

		console.log('Aegean | Attack::activateListeners => weaponCharacteristic', weaponCharacteristic)

		// if a characteristic property exists use it if its value is greater than the character's Might
		if(weaponCharacteristic) {
			if(this.context.characteristics.Might.value < this.context.characteristics[weaponCharacteristic.property.name].value) {
				characteristicName = weaponCharacteristic.property.name
			}
		}

		const characteristic = this.context.characteristics[characteristicName]
		const skill = this.context.skills[weapon.system.stats.Skill.value]
		const skillValue = parseInt(skill.value)

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
