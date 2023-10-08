
import { add } from '../helpers/list.js'
import { isEquipment, isPC, UNARMED_STRIKE } from '../helpers/utils.js'
import { AEGEAN } from '../helpers/config.js'
import { woundRoll } from '../helpers/wounds.js'

export class AegeanActor extends Actor {
	get talents() {
		return this.items.filter(item => item.type === 'talent')
	}

	get armour() {
		return this.items.filter(item => item.type === 'armour')
	}

	get weapons() {
		return [ ...this.items.filter(item => item.type === 'weapon'), UNARMED_STRIKE ]
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


	// methods for applying damage

	// apply damage by subtracting armour
	applyDamage(damage) {
		const armour = parseInt(this.system.defence.Armour.value)
		const modifiedDamage = damage - armour

		if(modifiedDamage > 0) {
			console.log(`Aegean | Actor::applyDamage => modifiedDamage=${modifiedDamage}`)

			this.addRisk(modifiedDamage)
		}
	}

	// roll a wound
	async applyWound(newWound) {
		// get the value of all current wounds and add to the new wound
		const totalWounds = (this.system.attributes.Wounds.value || []).map(({ value }) => value).reduce(add, 0)
		const currentScars = parseInt(this.system.attributes.Scars.value)

		console.log(`Aegean | Actor::applyWound => newWound=${newWound}, totalWounds=${totalWounds}`)

		const wound = await woundRoll(totalWounds, newWound)

		this.update({
			'system.attributes.Wounds.value': [ ...this.system.attributes.Wounds.value, wound],
			'system.attributes.Scars.value': currentScars + wound.value,
		})
	}

	// set Risk to the given value
	// apply as Wound if the character is vulnerable instead
	// if the character is now vulnerable apply a Wound
	setRisk(newRisk) {
		if(newRisk < 0) newRisk = 0

		const flags = this.getDerivedData()
		const currentRisk = parseInt(this.system.attributes.Risk.value)

		console.log(`Aegean | Actor::setRisk => newRisk=${newRisk}, currentRisk=${currentRisk}`)

		if(flags.vulnerable && newRisk > currentRisk) {
			this.applyWound(newRisk - currentRisk)
		}
		else {
			this.update({
				'system.attributes.Risk.value': newRisk
			})

			// if character is now vulnerable apply a 1 point Wound
			if(newRisk > flags.endurance && !flags.vulnerable) {
				console.log('Aegean | Actor::addRisk => NOW VULNERABLE apply 1 point wound')

				this.applyWound(1)
			}
		}
	}

	// reduce the Risk by the given amount
	reduceRisk(riskToRemove) {
		const newRisk = parseInt(this.system.attributes.Risk.value) - riskToRemove
		
		this.setRisk(newRisk)
	}

	// increase Risk by the given value
	// apply as Wound if the character is vulnerable instead
	// if the character is now vulnerable apply a Wound
	addRisk(riskToAdd) {
		const flags = this.getDerivedData()

		// if the character is vulnerable, roll a wound instead
		if(flags.vulnerable) {
			console.log('Aegean | Actor::addRisk => VULNERABLE')

			this.applyWound(riskToAdd)
		}
		else {
			const newRisk = parseInt(this.system.attributes.Risk.value) + riskToAdd

			console.log(`Aegean | Actor::addRisk => newRisk=${newRisk}`)

			this.update({
				'system.attributes.Risk.value': newRisk
			})

			// if character is now vulnerable apply a 1 point Wound
			if(newRisk > flags.endurance) {
				console.log('Aegean | Actor::addRisk => NOW VULNERABLE apply 1 point wound')

				this.applyWound(1)
			}
		}
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
		this.flags.aegean = this.getDerivedData()

		console.log('Aegean | Actor::prepareDerivedData', this.flags.aegean)
	}

	getDerivedData() {
		const flags = {}

		if(isPC(this.type)) {
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
		}

		if(this.type === 'legend') {
			flags.endurance = this.system.attributes.Endurance.value
			flags.vulnerable = this.system.attributes.Risk.value > flags.endurance
			flags.threshold = this.system.attributes.Risk.value === flags.endurance
		}

		return flags
	}

	getRollData() {
		const data = super.getRollData()

		data.flags = this.getDerivedData()
		data.actor = this.toObject(false)
		data.config = AEGEAN

		console.log('Aegean | Actor::getRollData', data)

		return data
	}
}
