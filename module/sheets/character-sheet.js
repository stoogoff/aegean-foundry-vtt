
import { AegeanActorSheet } from './actor-sheet.js'
import { AEGEAN } from '../helpers/config.js'
import { sortByProperty } from '../helpers/list.js'

export class AegeanCharacterSheet extends AegeanActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'actor'],
			template: 'systems/aegean/templates/actor/actor-character-sheet.html',
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

		context.advantages = this.actor.advantages
		context.armour = this.actor.armour
		context.equipment = this.actor.equipment.sort(sortByProperty('name'))
		context.gods = this.actor.gods
		context.parents = game.items.filter(item => item.type === 'deity' && item.system.stats.Parent.value).map(({ name }) => name)
		context.talents = this.actor.talents
		context.weapons = this.actor.weapons.sort(sortByProperty('name'))

		context.system.background.Fate.value = await TextEditor.enrichHTML(context.system.background.Fate.value, { async: true })

		console.log('Aegean | CharacterSheet::getData', context)

		return context
	}

	activateListeners(html) {
		super.activateListeners(html)
	
		if (!this.isEditable) return

		// enable updating linked item properties
		html.find('.set-favour').change(this._updateItemProperty(this.actor.gods).bind(this))

		// skill specialisations and hide the inputs
		html.find('.add-spec').click(this._editSpecs.bind(this))
		html.find('.specialisations input').hide()
	}

	_editSpecs(event) {
		const target = $(event.currentTarget)
		const parent = target.parent('.specialisations')
		const skill = target.attr('data-id')

		console.log(`Aegean | CharacterSheet::_onEditSpecs => skill='${skill}'`)

		parent.find('ul').hide()
		parent.find('input').show().blur(blurEvent => {
			const specialisations = this.actor.system.specialisations.value

			specialisations[skill] = $(blurEvent.currentTarget).val().split(',').map(val => val.trim()).filter(val => val !== '')

			console.log('Aegean | CharacterSheet::_onEditSpecs => specialisations', specialisations)

			this.actor.update({
				'system.specialisations.value': specialisations
			})
		})
	}
}
