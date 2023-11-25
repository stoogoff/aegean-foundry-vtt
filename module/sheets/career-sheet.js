
import { AegeanItemSheet } from './item-sheet.js'
import { sortByProperty } from '../helpers/list.js'

export class AegeanCareerSheet extends AegeanItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'career'],
			template: 'systems/aegean/templates/item/career-sheet.html',
			width: 600,
			height: 500,
			tabs: [{
				navSelector: '.tab-group',
				contentSelector: '.tab-panel',
				initial: 'career_stats',
			}],
		})
	}

	async getData() {
		const context = await super.getData();

		// make track names available
		context.tracks = []

		if(context.system.notes.Track1.value != '') context.tracks.push(context.system.notes.Track1.value)
		if(context.system.notes.Track2.value != '') context.tracks.push(context.system.notes.Track2.value)

		// group talents
		const talents = context.system.stats.Talents.value || []

		console.log('Aegean | CareerSheet::getData => talents', talents)

		// load up all talents from the ID and group by track, if it's available
		const loadedTalents = talents.map(talent => {
			return {
				...talent,
				actual: game.items.get(talent.id)
			}
		})

		const filterTalents = (talents, track) => {
			if(track === '') return []

			return talents.filter(talent => talent.track === track).sort(sortByProperty('order'))
		}

		// this will only be possible if one or more talent track names is set
		context.talents = {
			track1: filterTalents(loadedTalents, context.system.notes.Track1.value),
			track2: filterTalents(loadedTalents, context.system.notes.Track2.value),
			ungrouped: loadedTalents.filter(talent => !context.tracks.includes(talent.track)),
			length: talents.length,
		}

		// set up rich text
		if(context.system.notes.WorksWith) context.system.notes.WorksWith.value = await TextEditor.enrichHTML(context.system.notes.WorksWith.value, { async: true })
		if(context.system.notes.ChooseIf) context.system.notes.ChooseIf.value = await TextEditor.enrichHTML(context.system.notes.ChooseIf.value, { async: true })

		return context
	}

	activateListeners(html) {
		super.activateListeners(html)

		// enable accordions
		html.find('.accordion-activator').click(event => {
			$(event.currentTarget).closest('.accordion').toggleClass('active')
		})

		if(!this.isEditable) return

		// skills
		html.find('.add-multi-select').not('.disabled').click(this._addListValue.bind(this))
		html.find('.delete-multi-select').click(this._deleteListValue.bind(this))

		// talents and ordering
		html.find('.order-input').change(this._setTalentOrder.bind(this))
		html.find('.track-input').change(this._setTalentTrack.bind(this))
		html.find('.delete-talent').click(this._deleteTalent.bind(this))
	}

	_addListValue(event) {
		const addId = $(event.currentTarget).attr('data-id')
		const value = $(`#${addId}`).val()

		console.log('Aegean | CareerSheet::_addListValue => addId, value', addId, value)

		const key = addId.replace(/_/g, '.')
		const currentValue = this.item.getValueFromKey(key)

		if(!currentValue.includes(value)) {
			this.item.update({
				[key]: [ ...currentValue, value ]
			})
		}
	}

	_deleteListValue(event) {
		const deleteId = $(event.currentTarget).attr('data-id')

		console.log('Aegean | CareerSheet::_deleteListValue => deleteId', deleteId)

		const parts = deleteId.split('_')
		const index = parts.pop()
		const key = parts.join('.')

		const currentValue = this.item.getValueFromKey(key)

		currentValue.splice(index, 1)

		this.item.update({
			[key]: currentValue
		})
	}

	_setTalentOrder(event) {
		this._updateTalent(event, 'order')
	}

	_setTalentTrack(event) {
		this._updateTalent(event, 'track')
	}

	_deleteTalent(event) {
		const deleteId = $(event.currentTarget).attr('data-id')

		console.log('Aegean | CareerSheet::_deleteTalent => deleteId', deleteId)

		this.item.update({
			'system.stats.Talents.value': this.item.system.stats.Talents.value.filter(({ id }) => id !== deleteId),
		})
	}

	_updateTalent(event, property) {
		const target = $(event.currentTarget)
		const talentId = target.attr('data-id')
		const value = target.val()

		console.log('Aegean | CareerSheet::_setTalentOrder => talentId, value', talentId, value)

		const talent = this.item.system.stats.Talents.value.find(({ id }) => id === talentId)

		talent[property] = value

		this.item.update({
			'system.stats.Talents.value': this.item.system.stats.Talents.value,
		})
	}

	async _onDrop(event, data) {
		if(!event.originalEvent) return
		if(!event.originalEvent.dataTransfer) return

		let dragData = JSON.parse(event.originalEvent.dataTransfer.getData('text/plain'))

		console.log('Aegean | CareerSheet::_onDrop => dragData', dragData)

		if(!dragData.uuid.startsWith('Item.')) return

		// load the item by uuid (remove the Item prefix)
		const dragItem = game.items.get(dragData.uuid.replace('Item.', ''))

		console.log('Aegean | CareerSheet::_onDrop => dragItem', dragItem)

		if(dragItem.type === 'talent') {
			this.item.update({
				'system.stats.Talents.value': [ ...this.item.system.stats.Talents.value, { id: dragItem.id, order: 0, track: '' } ]
			})
		}
	}
}
