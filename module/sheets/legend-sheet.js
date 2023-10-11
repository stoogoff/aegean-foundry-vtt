
import { AegeanActorSheet } from './actor-sheet.js'
import { AEGEAN } from '../helpers/config.js'
import { sortByProperty, add } from '../helpers/list.js'
import { AttackRoll } from '../dialogs/attack-roll.js'
import { RecoveryRoll } from '../dialogs/recovery-roll.js'
import { SkillCheck } from '../dialogs/skill-check.js'
import Actions from '../helpers/actions.js'

export class AegeanLegendSheet extends AegeanActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'actor'],
			template: 'systems/aegean/templates/actor/actor-legend-sheet.html',
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

		context.config = AEGEAN
		context.system = actor.system
		context.flags = actor.flags.aegean

		//context.advantages = this.actor.advantages
		context.armour = this.actor.armour
		context.equipment = this.actor.equipment.sort(sortByProperty('name'))
		//context.gods = this.actor.gods
		//context.parents = game.items.filter(item => item.type === 'deity' && item.system.stats.Parent.value).map(({ name }) => name)
		context.talents = this.actor.talents
		context.weapons = this.actor.weapons.sort(sortByProperty('name'))

		context.system.background.Description.value = await TextEditor.enrichHTML(context.system.background.Description.value, { async: true })
		context.system.background.Tactics.value = await TextEditor.enrichHTML(context.system.background.Tactics.value, { async: true })

		console.log('Aegean | LegendSheet::getData', context)

		return context
	}
}
