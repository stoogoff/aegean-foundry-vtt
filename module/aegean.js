
// models
import { AegeanActor } from './documents/actor.js'
import { AegeanItem } from './documents/item.js'

// sheets
import { AegeanActorSheet } from './sheets/actor-sheet.js'
import { AegeanArmourSheet } from './sheets/armour-sheet.js'
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
	Items.registerSheet('Aegean', AegeanArmourSheet, {
		label: game.i18n.localize('aegean.combat.Armour'),
		types: ['armour'],
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
		'systems/aegean/templates/partials/box-input.hbs',
		'systems/aegean/templates/partials/checkbox.hbs',
		'systems/aegean/templates/partials/form-input.hbs',
		//'systems/aegean/templates/partials/multi-select-input.hbs',
		'systems/aegean/templates/partials/select-input.hbs',
		'systems/aegean/templates/partials/skill-input.hbs',
		'systems/aegean/templates/partials/tab-panel.hbs',

		// actor partials
		//'systems/aegean/templates/actor/partials/background.hbs',
		'systems/aegean/templates/actor/partials/character-stats.hbs',
		//'systems/aegean/templates/actor/partials/equipment.hbs',
		'systems/aegean/templates/actor/partials/header-section.hbs',
		//'systems/aegean/templates/actor/partials/talents.hbs',

		// item partials
		'systems/aegean/templates/item/partials/header-section.hbs',
		'systems/aegean/templates/item/partials/equipment.hbs',
	])

	Handlebars.registerHelper('concat', function() {
		const args = Array.from(arguments)

		args.pop()

		return args.join('')
	})
})


Hooks.once('ready', async function() {
	console.log('Aegean | Hook::ready')
	// Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
	Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot))
})
