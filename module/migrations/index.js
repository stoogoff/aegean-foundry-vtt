
import migration0_2_7 from './0-2-7.js'
import migration0_3_11 from './0-3-11.js'

const MIGRATIONS = [
	migration0_2_7,
	migration0_3_11,
]

// TODO so far migrations are non-destructive (if the actor has the data already it's not deleted)
// but this should really check the current version and only run if the migration is older than current version
export default () => {
	console.log('Aegean | Running migrations')

	// run migrations for actors
	MIGRATIONS.forEach(async migration => {
		if('migrateActor' in migration) {
			console.log(`Aegean | Running actor migrations for ${migration.version}`)

			for(const actor of game.actors) {
				const update = migration.migrateActor(actor.toObject())

				if(!foundry.utils.isEmpty(update)) {
					const result = await actor.update(update, { enforceTypes: false })

					console.log(`Aegean | Migrated Actor '${actor.name}'`, result)
				}
			}
		}
	})

	// run migrations for items
	MIGRATIONS.forEach(async migration => {
		if('migrateItem' in migration) {
			console.log(`Aegean | Running item migrations for ${migration.version}`)

			for(const item of game.items) {
				const update = migration.migrateItem(item.toObject())

				if (!foundry.utils.isEmpty(update)) {
					const result = await item.update(update, { enforceTypes: false })

					console.log(`Aegean | Migrated Item '${item.name}'`, result)
				}
			}
		}
	})
}

