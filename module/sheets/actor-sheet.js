
import { AttackRoll } from '../dialogs/attack-roll.js'
import { RecoveryRoll } from '../dialogs/recovery-roll.js'
import { SkillCheck } from '../dialogs/skill-check.js'
import Actions from '../helpers/actions.js'
import { isPC, UNARMED_STRIKE } from '../helpers/utils.js'

export class AegeanActorSheet extends ActorSheet {
	activateListeners(html) {
		super.activateListeners(html)
	
		// enable accordions
		html.find('.accordion-activator').click(event => {
			$(event.currentTarget).closest('.accordion').toggleClass('active')
		})

		// display roll dialogue
		html.find('.roll').click(this._skillCheckDialog.bind(this))

		// display attack dialogue
		html.find('.attack').click(this._attackDialog.bind(this))

		// combat actions
		html.find('.combat-actions .action').click(this._combatAction.bind(this))

		if (!this.isEditable) return

		// enable updating linked item properties
		html.find('.rating-input').change(this._updateItemProperty(this.actor.talents).bind(this))

		// enable delete actions
		html.find('.delete-action').click(this._deleteItem.bind(this))

		// enable clicking on the risk track
		html.find('.risk .track .boxed').click(this._setRisk.bind(this))

		// wounds and damage
		html.find('.damage-action').click(this._applyDamage.bind(this))
		html.find('.heal-wound').click(this._healWound.bind(this))
		html.find('.remove-wound').click(this._removeWound.bind(this))
		html.find('.recovery-action').click(this._recoveryRollDialog.bind(this))
		html.find('.adjust-wound-value').change(this._adjustWoundValue.bind(this))
	}

	_skillCheckDialog() {
		const context = this.actor.getRollData()

		console.log('Aegean | ActorSheet::_skillCheckDialog => context', context)

		SkillCheck.show(context)
	}

	_combatAction() {
		const actionId = $(event.currentTarget).attr('data-id')

		console.log('Aegean | ActorSheet::_combatAction => actionId', actionId)

		const context = this.actor.getRollData()
		const selection = Actions[actionId].selection()

		SkillCheck.show(context, selection, result => {
			Actions[actionId].effect(this.actor, result)
		})
	}

	_updateItemProperty(list) {
		return event => {
			const target = $(event.currentTarget)
			const dataId = target.attr('data-id')
			const key = target.attr('name')
			const value = target.val()

			console.log('Aegean | ActorSheet::_updateItemProperty => dataId, key, value', dataId, key, value)

			const obj = list.find(({ id }) => id === dataId)

			obj.update({
				[key]: value
			})			
		}
	}

	_setRisk(event) {
		const target = $(event.currentTarget)

		if(!target.hasClass('current')) {
			this.actor.setRisk(parseInt(target.attr('data-value')))
		}
	}

	_recoveryRollDialog() {
		const context = this.actor.getRollData()

		console.log('Aegean | ActorSheet::_recoveryRollDialog => context', context)

		RecoveryRoll.show(context, result => {
			this.actor.reduceRisk(result)
		})
	}

	_attackDialog() {
		const context = this.actor.getRollData()
		const attackId = $(event.currentTarget).attr('data-id')

		context.weapon = this.actor.weapons.find(({ _id }) => _id === attackId)

		console.log('Aegean | ActorSheet::_attackDialog => context, attackId', context, attackId)

		AttackRoll.show(context)
	}

	_applyDamage(event) {
		const value = parseInt($(event.currentTarget).parent('.action-bar').find('.damage-value').val())

		console.log(`Aegean | ActorSheet::_applyDamage => value=${value}`)

		this.actor.applyDamage(value)
	}

	_healWound(event) {
		const woundId = $(event.currentTarget).attr('data-id')

		console.log(`Aegean | ActorSheet::_healWound => woundId=${woundId}`)

		const wound = (this.actor.system.attributes.Wounds.value || []).find(({ id }) => id === woundId)

		console.log('Aegean | ActorSheet::_healWound => wound=', wound)

		wound.healed = !wound.healed

		this.actor.update({
			'system.attributes.Wounds.value': [ ...this.actor.system.attributes.Wounds.value ]
		})
	}

	_adjustWoundValue(event) {
		const target = $(event.currentTarget)
		const woundId = target.attr('data-id')
		const woundValue = target.val()

		console.log(`Aegean | ActorSheet::_adjustWoundValue => woundId=${woundId}`)

		const wound = (this.actor.system.attributes.Wounds.value || []).find(({ id }) => id === woundId)

		console.log('Aegean | ActorSheet::_adjustWoundValue => wound=', wound)

		wound.value = woundValue

		this.actor.update({
			'system.attributes.Wounds.value': [ ...this.actor.system.attributes.Wounds.value ]
		})
	}

	_removeWound(event) {
		const woundId = $(event.currentTarget).attr('data-id')

		console.log(`Aegean | ActorSheet::_removeWound => woundId=${woundId}`)

		const wounds = (this.actor.system.attributes.Wounds.value || []).filter(({ id }) => id !== woundId)

		this.actor.update({
			'system.attributes.Wounds.value': wounds
		})
	}

	_deleteItem(event) {
		const deleteId = $(event.currentTarget).attr('data-id')

		this.actor.deleteEmbeddedDocuments('Item', [ deleteId ])
	}

	async _onDropItem(event, data) {
		if(!event.dataTransfer) return

		let dragData = JSON.parse(event.dataTransfer.getData('text/plain'))

		console.log('Aegean | ActorSheet::_onDropItem => dragData', dragData)

		// load the item by uuid (remove the Item prefix)
		const dragItem = game.items.get(dragData.uuid.replace('Item.', ''))

		console.log('Aegean | ActorSheet::_onDropItem => dragItem', dragItem)

		if(!dragItem) return

		switch(dragItem.type) {
			// properties can't be dropped on a character
			case 'property':
				return

			// talents can only be dropped on a character once,
			// unless they're ranked or multiple
			case 'talent':
				if(!dragItem.system.stats.Ranked.value && !dragItem.system.stats.Multiple.value) {
					const existing = this.actor.talents.find(talent => talent.flags.core.sourceId === dragData.uuid)

					if(existing) return
				}

			// don't add an attack to a PC
			case 'attack':
				if(isPC(this.actor.type)) return
		}

		super._onDropItem(event, data)
	}
}
