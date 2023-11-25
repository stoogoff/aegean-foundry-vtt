
// models
import { AegeanActor } from './documents/actor.js'
import { AegeanItem } from './documents/item.js'

// sheets
import { AegeanAdvantageSheet } from './sheets/advantage-sheet.js'
import { AegeanArmourSheet } from './sheets/armour-sheet.js'
import { AegeanAttackSheet } from './sheets/attack-sheet.js'
import { AegeanCareerSheet } from './sheets/career-sheet.js'
import { AegeanCharacterSheet } from './sheets/character-sheet.js'
import { AegeanChampionSheet } from './sheets/champion-sheet.js'
import { AegeanCultSheet } from './sheets/cult-sheet.js'
import { AegeanDeitySheet } from './sheets/deity-sheet.js'
import { AegeanEquipmentSheet } from './sheets/equipment-sheet.js'
import { AegeanLegendSheet } from './sheets/legend-sheet.js'
import { AegeanMinionSheet } from './sheets/minion-sheet.js'
import { AegeanPropertySheet } from './sheets/property-sheet.js'
import { AegeanTalentSheet } from './sheets/talent-sheet.js'
import { AegeanWeaponSheet } from './sheets/weapon-sheet.js'

// helpers
import { AEGEAN } from './helpers/config.js'
import { isPC, isAdversary, isMinion, isChampion, isLegend, isEquipment } from './helpers/utils.js'

// migrations
import migrations from './migrations/index.js'

Hooks.once('init', async function() {
	console.log('Aegean | Hook::init')

	game.Aegean = {
		AegeanActor,
		AegeanItem,
	}

	CONFIG.AEGEAN = AEGEAN

	CONFIG.Actor.documentClass = AegeanActor
	CONFIG.Item.documentClass = AegeanItem

	Actors.unregisterSheet('core', ActorSheet)
	Actors.registerSheet('Aegean', AegeanCharacterSheet, {
		label: game.i18n.localize('aegean.ui.CharacterSheet'),
		types: ['character'],
		makeDefault: true,
	})
	Actors.registerSheet('Aegean', AegeanLegendSheet, {
		label: game.i18n.localize('aegean.ui.LegendSheet'),
		types: ['legend'],
	})
	Actors.registerSheet('Aegean', AegeanChampionSheet, {
		label: game.i18n.localize('aegean.ui.ChampionSheet'),
		types: ['champion'],
	})
	Actors.registerSheet('Aegean', AegeanMinionSheet, {
		label: game.i18n.localize('aegean.ui.MinionSheet'),
		types: ['minion'],
	})

	Items.unregisterSheet('core', ItemSheet)

	Items.registerSheet('Aegean', AegeanAdvantageSheet, {
		types: ['advantage'],
		makeDefault: true,
	})
	Items.registerSheet('Aegean', AegeanArmourSheet, {
		types: ['armour'],
		makeDefault: true,
	})
	Items.registerSheet('Aegean', AegeanAttackSheet, {
		types: ['attack'],
		makeDefault: true,
	})
	Items.registerSheet('Aegean', AegeanCareerSheet, {
		types: ['career'],
		makeDefault: true,
	})
	Items.registerSheet('Aegean', AegeanCultSheet, {
		types: ['cult'],
		makeDefault: true,
	})
	Items.registerSheet('Aegean', AegeanDeitySheet, {
		types: ['deity'],
		makeDefault: true,
	})
	Items.registerSheet('Aegean', AegeanEquipmentSheet, {
		types: ['equipment'],
		makeDefault: true,
	})
	Items.registerSheet('Aegean', AegeanPropertySheet, {
		types: ['property'],
		makeDefault: true,
	})
	Items.registerSheet('Aegean', AegeanTalentSheet, {
		types: ['talent'],
		makeDefault: true,
	})
	Items.registerSheet('Aegean', AegeanWeaponSheet, {
		types: ['weapon'],
		makeDefault: true,
	})

	loadTemplates([
		// global partials
		'systems/aegean/templates/partials/accordion.hbs',
		'systems/aegean/templates/partials/action.hbs',
		'systems/aegean/templates/partials/box-input.hbs',
		'systems/aegean/templates/partials/checkbox.hbs',
		'systems/aegean/templates/partials/difficulty-select.hbs',
		'systems/aegean/templates/partials/form-input.hbs',
		'systems/aegean/templates/partials/multi-select-input.hbs',
		'systems/aegean/templates/partials/multi-text-input.hbs',
		'systems/aegean/templates/partials/select-input.hbs',
		'systems/aegean/templates/partials/skill-input.hbs',
		'systems/aegean/templates/partials/tab-panel.hbs',
		'systems/aegean/templates/partials/value-select.hbs',
		'systems/aegean/templates/partials/value-text.hbs',

		// actor partials
		'systems/aegean/templates/actor/partials/advantages.hbs',
		'systems/aegean/templates/actor/partials/adversary-background.hbs',
		'systems/aegean/templates/actor/partials/adversary-stats.hbs',
		'systems/aegean/templates/actor/partials/background.hbs',
		'systems/aegean/templates/actor/partials/character-stats.hbs',
		'systems/aegean/templates/actor/partials/combat.hbs',
		'systems/aegean/templates/actor/partials/equipment.hbs',
		'systems/aegean/templates/actor/partials/header-section.hbs',
		'systems/aegean/templates/actor/partials/risk.hbs',
		'systems/aegean/templates/actor/partials/talents.hbs',
		'systems/aegean/templates/actor/partials/the-gods.hbs',

		// item partials
		'systems/aegean/templates/item/partials/header-section.hbs',
		'systems/aegean/templates/item/partials/equipment.hbs',
		'systems/aegean/templates/item/partials/properties.hbs',
		'systems/aegean/templates/item/partials/talents.hbs',
	])

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
})


Hooks.once('ready', async function() {
	console.log('Aegean | Hook::ready')
	migrations()
})
