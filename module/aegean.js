
// models
import { AegeanActor } from './documents/actor.js'
import { AegeanItem } from './documents/item.js'

// sheets
import { AegeanActorSheet } from './sheets/actor-sheet.js'
import { AegeanAdvantageSheet } from './sheets/advantage-sheet.js'
import { AegeanArmourSheet } from './sheets/armour-sheet.js'
import { AegeanDeitySheet } from './sheets/deity-sheet.js'
import { AegeanEquipmentSheet } from './sheets/equipment-sheet.js'
import { AegeanPropertySheet } from './sheets/property-sheet.js'
import { AegeanTalentSheet } from './sheets/talent-sheet.js'
import { AegeanWeaponSheet } from './sheets/weapon-sheet.js'

// helpers
import { AEGEAN } from './helpers/config.js'

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
	Actors.registerSheet('Aegean', AegeanActorSheet, {
		label: game.i18n.localize('aegean.ui.CharacterSheet'),
		makeDefault: true,
	})

	Items.unregisterSheet('core', ItemSheet)
	//Items.registerSheet('Aegean', AegeanItemSheet, { makeDefault: true })

	Items.registerSheet('Aegean', AegeanAdvantageSheet, {
		label: game.i18n.localize('aegean.system.Advantage'),
		types: ['advantage'],
		makeDefault: true,
	})
	Items.registerSheet('Aegean', AegeanArmourSheet, {
		label: game.i18n.localize('aegean.combat.Armour'),
		types: ['armour'],
		makeDefault: true,
	})
	Items.registerSheet('Aegean', AegeanDeitySheet, {
		label: game.i18n.localize('aegean.system.Deity'),
		types: ['deity'],
		makeDefault: true,
	})
	Items.registerSheet('Aegean', AegeanEquipmentSheet, {
		label: game.i18n.localize('aegean.system.Equipment'),
		types: ['equipment'],
		makeDefault: true,
	})
	Items.registerSheet('Aegean', AegeanPropertySheet, {
		label: game.i18n.localize('aegean.equipment.Property'),
		types: ['property'],
		makeDefault: true,
	})
	Items.registerSheet('Aegean', AegeanTalentSheet, {
		label: game.i18n.localize('aegean.system.Talent'),
		types: ['talent'],
		makeDefault: true,
	})
	Items.registerSheet('Aegean', AegeanWeaponSheet, {
		label: game.i18n.localize('aegean.combat.Weapon'),
		types: ['weapon'],
		makeDefault: true,
	})

	loadTemplates([
		// global partials
		'systems/aegean/templates/partials/accordion.hbs',
		'systems/aegean/templates/partials/action.hbs',
		'systems/aegean/templates/partials/box-input.hbs',
		'systems/aegean/templates/partials/checkbox.hbs',
		'systems/aegean/templates/partials/form-input.hbs',
		'systems/aegean/templates/partials/multi-select-input.hbs',
		'systems/aegean/templates/partials/multi-text-input.hbs',
		'systems/aegean/templates/partials/select-input.hbs',
		'systems/aegean/templates/partials/skill-input.hbs',
		'systems/aegean/templates/partials/tab-panel.hbs',

		// actor partials
		'systems/aegean/templates/actor/partials/advantages.hbs',
		'systems/aegean/templates/actor/partials/background.hbs',
		'systems/aegean/templates/actor/partials/character-stats.hbs',
		'systems/aegean/templates/actor/partials/equipment.hbs',
		'systems/aegean/templates/actor/partials/header-section.hbs',
		'systems/aegean/templates/actor/partials/talents.hbs',

		// item partials
		'systems/aegean/templates/item/partials/header-section.hbs',
		'systems/aegean/templates/item/partials/equipment.hbs',
		'systems/aegean/templates/item/partials/properties.hbs',
	])

	Handlebars.registerHelper('concat', function() {
		const args = Array.from(arguments)

		args.pop()

		return args.join('')
	})

	Handlebars.registerHelper('join', function(array) {
		return array.join(', ')
	})

	Handlebars.registerHelper('join', function(array) {
		return array.join(', ')
	})

	// comparison functions
	Handlebars.registerHelper('eq', (val1, val2) => val1 === val2)
	Handlebars.registerHelper('lt', (val1, val2) => val1 < val2)
	Handlebars.registerHelper('lte', (val1, val2) => val1 <= val2)
	Handlebars.registerHelper('gt', (val1, val2) => val1 > val2)
	Handlebars.registerHelper('gte', (val1, val2) => val1 >= val2)
})


Hooks.once('ready', async function() {
	console.log('Aegean | Hook::ready')
	// Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
	Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot))
})
