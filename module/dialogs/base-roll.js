
import { add } from '../helpers/list.js'
import { roll } from '../helpers/dice-roller.js'

export default class BaseRoll extends Dialog {
	_setDiceValue(target, key, dice, attr, suffix = '') {
		target.parent().find(`#${key}_value`).text(`${dice}${suffix}`).attr(attr, dice)
	}

	_updateFromValue(attr = 'data-value') {
		return event => {
			const target = $(event.currentTarget)
			const key = target.attr('name')
			const dice = target.val()

			console.log(`Aegean | BaseRoll::_updateFromValue => key=${key}, dice=${dice}`)

			this._setDiceValue(target, key, dice, attr)
		}
	}

	_applySpec(event) {
		const target = $(event.currentTarget)
		const key = target.attr('name')
		const value = target.val()
		const dice = value === '' ? 0 : 1

		console.log(`Aegean | BaseRoll::_applySpec => key=${key}, value=${value}, dice=${dice}`)

		this._setDiceValue(target, key, dice, 'data-value', 'D')
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

export const calculateResultAndSendToChat = async (html, context, title) => {
	let dice = html.find('[data-value]').map(function() {
		return parseInt($(this).attr('data-value'))
	}).get().reduce(add, 0)

	if(context.flags.vulnerable) ++dice

	const difficulty = html.find('[data-difficulty]').attr('data-difficulty') || 0

	// dice syntax: /roll 5d10cs>=8
	const result = await roll(dice, difficulty)

	// calculate damage if a weapon is included in the context
	let damage = 0

	console.log(context.weapon)

	if(context.weapon) {
		damage = parseInt(context.weapon.system.stats.Damage.value) + result.successes
	}

	// send results to chat
	const content = await renderTemplate('systems/aegean/templates/messages/skill-check.html', {
		title,
		dice: result,
		difficulty,
		characteristic: html.find('[name=characteristic]').val(),
		skill: html.find('[name=skill]').val(),
		damage,
	})

	ChatMessage.create({
		title: game.i18n.localize(title),
		content,
		speaker: ChatMessage.getSpeaker({ actor: context.actor }),
	})

	return result
}
