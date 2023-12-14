
import { isPC, isAdversary, isMinion, isChampion, isLegend, isEquipment } from './utils.js'

export const registerHelpers = () => {
	Handlebars.registerHelper('concat', function() {
		const args = Array.from(arguments)

		args.pop()

		return args.join('')
	})

	Handlebars.registerHelper('join', function(array) {
		return array.join(', ')
	})

	// repeat a block a number of times
	Handlebars.registerHelper('range', (count, options) => {
		const buffer = []
		const data = options.data ? Handlebars.createFrame(options.data) : {}

		for(let i = 0; i < count; ++i) {
			data.first = i === 0
			data.last = i === i - 1
			data.index = i

			buffer.push(options.fn(this, { data: data }))
		}

		return buffer.join('')
	})
	Handlebars.registerHelper('range-reverse', (count, options) => {
		const buffer = []
		const data = options.data ? Handlebars.createFrame(options.data) : {}

		for(let i = count; i >= 0; --i) {
			data.first = i === 0
			data.last = i === i - 1
			data.index = i

			buffer.push(options.fn(this, { data: data }))
		}

		return buffer.join('')
	})

	// comparison functions
	Handlebars.registerHelper('eq', (val1, val2) => val1 == val2)
	Handlebars.registerHelper('ne', (val1, val2) => val1 != val2)
	Handlebars.registerHelper('lt', (val1, val2) => val1 < val2)
	Handlebars.registerHelper('lte', (val1, val2) => val1 <= val2)
	Handlebars.registerHelper('gt', (val1, val2) => val1 > val2)
	Handlebars.registerHelper('gte', (val1, val2) => val1 >= val2)
	Handlebars.registerHelper('mod', (val1, val2) => val1 > 0 && val1 % val2 === 0)
	Handlebars.registerHelper('and', (val1, val2) => val1 && val2)
	Handlebars.registerHelper('or', (val1, val2) => val1 || val2)

	// Aegean system functions
	Handlebars.registerHelper('xp', order => (order + 1) * 5)

	// actor / item type check functions
	Handlebars.registerHelper('isPC', actor => isPC(actor.type))
	Handlebars.registerHelper('isAdversary', actor => isAdversary(actor.type))
	Handlebars.registerHelper('isEquipment', item => isEquipment(item.type))
	Handlebars.registerHelper('isMinion', actor => isMinion(actor.type))
	Handlebars.registerHelper('isChampion', actor => isChampion(actor.type))
	Handlebars.registerHelper('isLegend', actor => isLegend(actor.type))
}
