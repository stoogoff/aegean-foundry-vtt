
import { AegeanActor } from './documents/actor.js'
import { AegeanItem } from './documents/item.js'
import { AegeanActorSheet } from './sheets/actor-sheet.js'
import { AegeanItemSheet } from './sheets/item-sheet.js'
import { AEGEAN } from './helpers/config.js'

Hooks.once('init', async function() {
	console.log('Aegean | Init hook')

	// Add utility classes to the global game object so that they're more easily
	// accessible in global contexts.
	game.Aegean = {
		AegeanActor,
		AegeanItem,
	}

	CONFIG.AEGEAN = AEGEAN

	CONFIG.Actor.documentClass = AegeanActor
	CONFIG.Item.documentClass = AegeanItem

	Actors.unregisterSheet('core', ActorSheet)
	Actors.registerSheet('Aegean', AegeanActorSheet, { label: 'Aegean Character Sheet', makeDefault: true })
	//Items.unregisterSheet('core', ItemSheet)
	//Items.registerSheet('Aegean', AegeanItemSheet, { makeDefault: true })
})


Hooks.once('ready', async function() {
	console.log('AEGEAN hook::ready')
	// Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
	Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot))
})
