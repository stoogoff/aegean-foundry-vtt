
import { AegeanActorSheet } from './actor-sheet.js'
import { AEGEAN } from '../../helpers/config.js'
import { sortByProperty, add } from '../../helpers/list.js'
import { AttackRoll } from '../../dialogs/attack-roll.js'
import { RecoveryRoll } from '../../dialogs/recovery-roll.js'
import { SkillCheck } from '../../dialogs/skill-check.js'
import Actions from '../../helpers/actions.js'

export class AegeanLegendSheet extends AegeanActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'actor'],
			template: 'systems/aegean/templates/actor/actor-adversary-sheet.html',
			width: 800,
			height: 600,
			tabs: [
				{
					navSelector: '.tab-group',
					contentSelector: '.tab-panel',
					initial: 'character_stats',
				},
			],
		})
	}

	/** @override */
	async getData() {
		const context = super.getData()
		const actor = this.actor.toObject(false)

		context.sheetTitle = 'TYPES.Actor.legend'
		context.config = AEGEAN
		context.system = actor.system
		context.flags = actor.flags.aegean

		context.armour = this.actor.armour
		context.equipment = this.actor.equipment.sort(sortByProperty('name'))
		context.talents = this.actor.talents
		context.weapons = this.actor.weapons.sort(sortByProperty('name'))

		if(context.system.background.Description) context.system.background.Description.value = await TextEditor.enrichHTML(context.system.background.Description.value, { async: true })
		if(context.system.background.Tactics) context.system.background.Tactics.value = await TextEditor.enrichHTML(context.system.background.Tactics.value, { async: true })
		if(context.system.background.ArcaneLore) context.system.background.ArcaneLore.value = await TextEditor.enrichHTML(context.system.background.ArcaneLore.value, { async: true })

		console.log('Aegean | LegendSheet::getData', context)

		return context
	}
}
