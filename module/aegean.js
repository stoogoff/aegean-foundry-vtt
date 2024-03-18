
// models
import { AegeanActor } from './documents/actor.js'
import { AegeanItem } from './documents/item.js'

// actor sheets
import { AegeanCharacterSheet } from './sheets/actors/character-sheet.js'
import { AegeanChampionSheet } from './sheets/actors/champion-sheet.js'
import { AegeanLegendSheet } from './sheets/actors/legend-sheet.js'
import { AegeanMinionSheet } from './sheets/actors/minion-sheet.js'

// item sheets
import { AegeanAdvantageSheet } from './sheets/items/advantage-sheet.js'
import { AegeanArmourSheet } from './sheets/items/armour-sheet.js'
import { AegeanAttackSheet } from './sheets/items/attack-sheet.js'
import { AegeanCareerSheet } from './sheets/items/career-sheet.js'
import { AegeanCultSheet } from './sheets/items/cult-sheet.js'
import { AegeanDeitySheet } from './sheets/items/deity-sheet.js'
import { AegeanEquipmentSheet } from './sheets/items/equipment-sheet.js'
import { AegeanPropertySheet } from './sheets/items/property-sheet.js'
import { AegeanTalentSheet } from './sheets/items/talent-sheet.js'
import { AegeanWeaponSheet } from './sheets/items/weapon-sheet.js'

// polis sheets
import { AegeanBuildingSheet } from './sheets/polis/building-sheet.js'
import { AegeanRetainerSheet } from './sheets/polis/retainer-sheet.js'

// helpers
import { AEGEAN } from './helpers/config.js'
import { registerHelpers } from './helpers/handlebars.js'

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

	// actor sheets
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

	// item sheets
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

	// polis sheets
	Items.registerSheet('Aegean', AegeanBuildingSheet, {
		types: ['building'],
		makeDefault: true,
	})
	Items.registerSheet('Aegean', AegeanRetainerSheet, {
		types: ['retainer'],
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
		'systems/aegean/templates/partials/multi-select-editable-input.hbs',
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
		'systems/aegean/templates/item/partials/requirements.hbs',
		'systems/aegean/templates/item/partials/talents.hbs',
	])

	// register handlebars helpers
	registerHelpers()
})


Hooks.once('ready', async function() {
	console.log('Aegean | Hook::ready')
	migrations()
})
