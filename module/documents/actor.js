
import { sum } from '../helpers/list.js'
import { isEquipment } from '../helpers/utils.js'

export class AegeanActor extends Actor {
	get talents() {
		return this.items.filter(item => item.type === 'talent')
	}

	get armour() {
		return this.items.filter(item => item.type === 'armour')
	}

	get weapons() {
		return this.items.filter(item => item.type === 'weapon')
	}

	get equipment() {
		return this.items.filter(item => isEquipment(item.type))
	}

	get advantages() {
		return this.items.filter(item => item.type === 'advantage')
	}

	get gods() {
		return this.items.filter(item => item.type === 'deity')
	}

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
	/*prepareBaseData() {
		// Data modifications in this step occur before processing embedded
		// documents or derived data.
		return super.prepareBaseData()
	}*/

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
		console.log('Aegean | prepareDerivedData')

		this.system.hasDivineHeritage = this.system.background.Heritage.value === 'Divine'
		
		this.system.encumbrance = this.equipment
			.map(item => parseInt(item.system.equipment.Weight.value)).reduce(sum, 0)


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
