
import migration027 from './0-2-7.js'

const MIGRATIONS = [
	migration027,
]

export default () => {
	console.log('Aegean | Running migrations')

	let logged = false 

	// run migrations for actors
	for(const actor of game.actors) {
		MIGRATIONS.forEach(async migration => {
			if(!logged) console.log(`Aegean | Running actor migrations for ${migration.version}`)

			logged = true

			if('migrateActor' in migration) {
				const update = migration.migrateActor(actor.toObject())

				if(!foundry.utils.isEmpty(update)) {
					const result = await actor.update(update, { enforceTypes: false })

					console.log(`Aegean | Migrated Actor '${actor.name}'`, result)
				}
			}
		})
	}

	logged = false

	// run migrations for items
	for(const item of game.items) {
		MIGRATIONS.forEach(async migration => {
			if(!logged) console.log(`Aegean | Running item migrations for ${migration.version}`)

			logged = true

			if('migrateItem' in migration) {
				const update = migration.migrateItem(item.toObject())

				if (!foundry.utils.isEmpty(update)) {
					const result = await item.update(update, { enforceTypes: false })

					console.log(`Aegean | Migrated Item '${item.name}'`, result)
				}
			}
		})
	}
}

