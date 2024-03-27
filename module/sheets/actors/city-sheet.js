
import { AEGEAN } from '../../helpers/config.js'
import { sortByProperty } from '../../helpers/list.js'

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

		if(!this.isEditable) return

		// enable delete actions
		html.find('.delete-action').click(this._deleteItem.bind(this))

		// enable updating linked item properties
		html.find('.building-input').change(this._updateItemProperty(this.actor.buildings).bind(this))
		html.find('.retainer-input').change(this._updateItemProperty(this.actor.retainers).bind(this))
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

		// generate characteristics and attributes from buildings and retainers
		const characteristics = {}
		const structures = [...context.buildings, ...context.retainers]

		AEGEAN.cityCharacteristics.forEach(ch => characteristics[ch] = 0)

		structures.forEach(st => {
			st.system.modifiers.Characteristics.value.forEach(ch => {
				characteristics[ch.text] += ch.value
			})
		})

		context.characteristics = characteristics

		console.log('Aegean | CitySheet::getData', context)

		return context
	}

	async _onDropItem(event, data) {
		if(!event.dataTransfer) return

		let dragData = JSON.parse(event.dataTransfer.getData('text/plain'))

		console.log('Aegean | CitySheet::_onDropItem => dragData', dragData)

		// load the item by uuid (remove the Item prefix)
		const dragItem = game.items.get(dragData.uuid.replace('Item.', ''))

		console.log('Aegean | CitySheet::_onDropItem => dragItem', dragItem)

		if(!dragItem) return

		if(dragItem.type === 'building' || dragItem.type === 'retainer') {
			console.log('Aegean | CitySheet(super)::_onDropItem', event, data)

			super._onDropItem(event, data)
		}
	}
}
