
import { AEGEAN } from '../../helpers/config.js'
import { sortByProperty } from '../../helpers/list.js'
import { isBuilding, isRetainer, isArkhon } from '../../helpers/utils.js'
import { SkillCheck } from '../../dialogs/skill-check.js'

export class AegeanCitySheet extends ActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'city'],
			template: 'systems/aegean/templates/actor/actor-city-sheet.html',
			width: 800,
			height: 600,
			tabs: [
				{
					navSelector: '.tab-group',
					contentSelector: '.tab-panel',
					initial: 'city_stats',
				},
			],
		})
	}

	activateListeners(html) {
		super.activateListeners(html)
	
		// enable accordions
		html.find('.accordion-activator').click(event => {
			$(event.currentTarget).closest('.accordion').toggleClass('active')
		})

		// display roll dialogue
		html.find('.roll').click(this._skillCheckDialog.bind(this))

		if(!this.isEditable) return

		// enable delete actions
		html.find('.delete-action').click(this._deleteItem.bind(this))

		// enable updating linked item properties
		html.find('.building-input').change(this._updateItemProperty(this.actor.buildings).bind(this))
		html.find('.retainer-input').change(this._updateItemProperty(this.actor.retainers).bind(this))
	}

	_skillCheckDialog() {
		const context = this.actor.getRollData()
		const selection = {}

		// prefill assistance
		if(context.flags.assistance) {
			selection.modifier = context.flags.assistance
		}

		// add characteristics and skills
		context.characteristics = this._generateCharacteristics(this.actor.buildings, this.actor.retainers)
		context.skills = this._generateSkills(this.actor.arkhons)

		console.log('Aegean | CitySheet::_skillCheckDialog => context', context)

		SkillCheck.show(context, selection)
	}

	_updateItemProperty(list) {
		return event => {
			const target = $(event.currentTarget)
			const dataId = target.attr('data-id')
			const key = target.attr('name')
			const value = target.val()

			console.log('Aegean | CitySheet::_updateItemProperty => dataId, key, value', dataId, key, value)

			const obj = list.find(({ id }) => id === dataId)

			obj.update({
				[key]: value
			})			
		}
	}

	_deleteItem(event) {
		const deleteId = $(event.currentTarget).attr('data-id')

		this.actor.deleteEmbeddedDocuments('Item', [ deleteId ])
	}

	/** @override */
	getData() {
		const context = super.getData()
		const actor = this.actor.toObject(false)

		context.config = AEGEAN
		context.system = actor.system
		context.flags = actor.flags.aegean

		context.buildings = this.actor.buildings.sort(sortByProperty('name'))
		context.retainers = this.actor.retainers.sort(sortByProperty('name'))
		context.arkhons = this.actor.arkhons.sort(sortByProperty('name'))

		// TODO generate attributes?
		context.characteristics = this._generateCharacteristics(context.buildings, context.retainers)
		context.skills = this._generateSkills(context.arkhons)

		console.log('Aegean | CitySheet::getData', context)

		return context
	}

	// generate characteristics and attributes from buildings and retainers
	_generateCharacteristics(buildings, retainers) {
		const characteristics = {}
		const structures = [...buildings, ...retainers]

		AEGEAN.cityCharacteristics.forEach(ch => characteristics[ch] = { value: 0, label: ch })

		structures.forEach(st => {
			st.system.modifiers.Characteristics.value.forEach(ch => {
				characteristics[ch.text].value += parseInt(ch.value)
			})
		})

		return characteristics
	}

	// generate skills from arkhon(s)
	_generateSkills(arkhons) {
		const skills = {}

		AEGEAN.skills.forEach(sk => skills[sk] = { value: 0, label: sk })

		arkhons.forEach(arkhon => arkhon.system.modifiers.Skills.value.forEach(sk => skills[sk.text].value += parseInt(sk.value)))

		return skills
	}

	async _onDropItem(event, data) {
		if(!event.dataTransfer) return

		let dragData = JSON.parse(event.dataTransfer.getData('text/plain'))

		console.log('Aegean | CitySheet::_onDropItem => dragData', dragData)

		// load the item by uuid (remove the Item prefix)
		const dragItem = game.items.get(dragData.uuid.replace('Item.', ''))

		console.log('Aegean | CitySheet::_onDropItem => dragItem', dragItem)

		if(!dragItem) return

		if(isBuilding(dragItem.type) || isRetainer(dragItem.type)) {
			console.log('Aegean | CitySheet(super)::_onDropItem', event, data)

			super._onDropItem(event, data)
		}

		if(isArkhon(dragItem.type) && this.actor.arkhons.length === 0) {
			console.log('Aegean | CitySheet(super)::_onDropItem', event, data)

			super._onDropItem(event, data)
		}
	}
}
