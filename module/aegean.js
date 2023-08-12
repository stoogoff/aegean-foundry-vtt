
import { AegeanActor } from './documents/actor'
import { AegeanItem } from './documents/item'
import { AegeanActorSheet } from './sheets/actor-sheet'
import { AegeanItemSheet } from './sheets/item-sheet'
import { AEGEAN } from './helpers/config'
import { AegeanActorSheet } from './sheets/actor-sheet'

Hooks.once('init', async function() {
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
	Actors.registerSheet('Aegean', AegeanActorSheet, { label: 'Vue', makeDefault: true })
	//Items.unregisterSheet('core', ItemSheet)
	//Items.registerSheet('Aegean', AegeanItemSheet, { makeDefault: true })
})


Hooks.once('ready', async function() {
	// Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
	Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot))
})
