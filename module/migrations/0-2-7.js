
export default {
	version: '0.2.7',

	migrateActor(actor) {
		const updated = {}

		if(actor.type !== 'character') return updated

		if(!('Dodge' in actor.system.defence)) {
			updated['system.defence.Dodge'] = {
				label: 'aegean.combat.Dodge',
				value: 0,
				used: false,
			}
		}

		return updated
	},

	migrateItem(item) {
		const updated = {}

		if(item.type !== 'talent') return updated

		if(!('Active' in item.system.stats)) {
			updated['system.stats.Active'] = {
				label: 'aegean.system.Active',
				value: false,
			}
		}

		return updated
	}
}