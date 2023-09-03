
import { add } from '../helpers/list.js'
import { isEquipment } from '../helpers/utils.js'
import { AEGEAN } from '../helpers/config.js'

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
		console.log('Aegean | Actor::prepareData', data)
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
		this.flags.aegean = this._getDerivedData()

		console.log('Aegean | Actor::prepareDerivedData', this.flags.aegean)
	}

	_getDerivedData() {
		const flags = {}

		flags.hasDivineHeritage = this.system.background.Heritage.value === 'Divine'
		
		flags.encumbrance = this.equipment
			.map(item => parseInt(item.system.equipment.Weight.value)).reduce(add, 0)

		flags.cumbersome = this.equipment.flatMap(
			({ properties }) => properties.filter(({ property }) => property.name === 'Cumbersome')
		).map(({ rating }) => parseInt(rating)).reduce(add, 0)

		flags.endurance = this.system.attributes.Endurance.value - flags.cumbersome
		flags.vulnerable = this.system.attributes.Risk.value > flags.endurance
		flags.threshold = this.system.attributes.Risk.value === flags.endurance
		flags.encumbered = flags.encumbrance > parseInt(this.system.characteristics.Might.value) + AEGEAN.encumbrance		

		return flags
	}

	getRollData() {
		const data = super.getRollData()

		data.flags = this._getDerivedData()

		console.log('Aegean | Actor::getRollData', data)

		return data
	}
}
