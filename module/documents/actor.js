/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class AegeanActor extends Actor {
	prepareData() {
	// Prepare data for the actor. Calling the super version of this executes
	// the following, in order: data reset (to clear active effects),
	// prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
	// prepareDerivedData().
		const data = super.prepareData()
		console.log('AEGEAN Actor::prepareData', data)
		return data
	}

	/** @override */
	prepareBaseData() {
		// Data modifications in this step occur before processing embedded
		// documents or derived data.
		return super.prepareBaseData()
	}

	/**
	 * @override
	 * Augment the basic actor data with additional dynamic data. Typically,
	 * you'll want to handle most of your calculated/derived data in this step.
	 * Data calculated in this step should generally not exist in template.json
	 * (such as ability modifiers rather than ability scores) and should be
	 * available both inside and outside of character sheets (such as if an actor
	 * is queried and has a roll executed directly from it).
	 */
	prepareDerivedData() {
		console.log(this.data)
		/*const actorData = this.data;
		const data = actorData.data;
		const flags = actorData.flags.Aegean || {};

		// Make separate methods for each Actor type (character, npc, etc.) to keep
		// things organized.
		this._prepareCharacterData(actorData);
		this._prepareNpcData(actorData);*/
	}

	/**
	 * Override getRollData() that's supplied to rolls.
	 */
	getRollData() {
		const data = super.getRollData()
		console.log('AEGEAN Actor::getRollData', data)

		return data
	}
}
