
export default {
	version: '0.3.11',

	migrateActor(actor) {
		const updated = {}

		if(actor.type !== 'legend') return updated

		if(!('Wounds' in actor.system.attributes)) {
			updated['system.attributes.Wounds'] = {
				label: 'aegean.system.Wounds',
				value: [],
			}
		}

		return updated
	}
}