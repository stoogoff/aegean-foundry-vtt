
import { AegeanItemSheet } from './item-sheet.js'
import { sortByProperty } from '../helpers/list.js'
import { createId } from '../helpers/string.js'

export class AegeanTalentTrackSheet extends AegeanItemSheet {
	async getData() {
		const context = await super.getData();

		// make track names available
		context.tracks = []

		if(context.system.notes.Track1.value != '') context.tracks.push(context.system.notes.Track1.value)
		if(context.system.notes.Track2.value != '') context.tracks.push(context.system.notes.Track2.value)

		console.log('Aegean | TalentTrackSheet::getData => tracks', context.tracks)

		// group talents
		const talents = context.system.stats.Talents.value || []

		// load up all talents from the ID and group by track, if it's available
		const loadedTalents = talents.map(talent => {
			return {
				...talent,
				actual: game.items.get(talent.talentId)
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

		console.log('Aegean | TalentTrackSheet::getData => talents', context.talents)

		return context
	}

	activateListeners(html) {
		super.activateListeners(html)

		// enable accordions
		html.find('.accordion-activator').click(event => {
			$(event.currentTarget).closest('.accordion').toggleClass('active')
		})

		if(!this.isEditable) return

		// talents and ordering
		html.find('.order-input').change(this._setTalentOrder.bind(this))
		html.find('.track-input').change(this._setTalentTrack.bind(this))
		html.find('.delete-talent').click(this._deleteTalent.bind(this))
	}


	_setTalentOrder(event) {
		this._updateTalent(event, 'order')
	}

	_setTalentTrack(event) {
		this._updateTalent(event, 'track')
	}

	_deleteTalent(event) {
		const deleteId = $(event.currentTarget).attr('data-id')

		console.log('Aegean | TalentTrackSheet::_deleteTalent => deleteId', deleteId)

		this.item.update({
			'system.stats.Talents.value': this.item.system.stats.Talents.value.filter(({ id }) => id !== deleteId),
		})
	}

	_updateTalent(event, property) {
		const target = $(event.currentTarget)
		const talentId = target.attr('data-id')
		const value = target.val()

		console.log('Aegean | TalentTrackSheet::_setTalentOrder => talentId, value', talentId, value)

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

		console.log('Aegean | TalentTrackSheet::_onDrop => dragData', dragData)

		if(!dragData.uuid.startsWith('Item.')) return

		// load the item by uuid (remove the Item prefix)
		const dragItem = game.items.get(dragData.uuid.replace('Item.', ''))

		console.log('Aegean | TalentTrackSheet::_onDrop => dragItem', dragItem)

		if(dragItem.type === 'talent') {
			this.item.update({
				'system.stats.Talents.value': [ ...this.item.system.stats.Talents.value, { id: createId(), talentId: dragItem.id, order: 0, track: '' } ]
			})
		}
	}
}
