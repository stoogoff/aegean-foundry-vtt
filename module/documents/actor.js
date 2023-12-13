
import { add } from '../helpers/list.js'
import { isEquipment, isPC, isAdversary, isLegend, isChampion, isMinion, UNARMED_STRIKE } from '../helpers/utils.js'
import { AEGEAN } from '../helpers/config.js'
import { woundRoll } from '../helpers/wounds.js'

export class AegeanActor extends Actor {
	get talents() {
		return this.items.filter(({ type }) => type === 'talent')
	}

	get armour() {
		return this.items.filter(({ type }) => type === 'armour')
	}

	get weapons() {
		const weapons = this.items.filter(({ type }) => type === 'weapon')

		if(isPC(this.type))
			return [ ...weapons, UNARMED_STRIKE ]

		return [ ...weapons, ...this.items.filter(({ type }) => type === 'attack') ]
	}

	get equipment() {
		return this.items.filter(({ type }) => isEquipment(type))
	}

	get advantages() {
		return this.items.filter(({ type }) => type === 'advantage')
	}

	get gods() {
		return this.items.filter(({ type }) => type === 'deity')
	}

	get careers() {
		return this.items.filter(({ type }) => type === 'career')
	}

	get cults() {
		return this.items.filter(({ type }) => type === 'cult')
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
		if(isPC(this.type)) {
			await this._applyPCWound(newWound)
		}

		if(isLegend(this.type)) {
			await this._applyLegendWound(newWound)
		}

		if(isChampion(this.type)) {
			this._applyChampionWound()
		}
	}

	// champions have a wound value
	_applyChampionWound() {
		const currentWounds = parseInt(this.system.stats.Wounds.value)

		this.update({
			'system.stats.Wounds.value': currentWounds - 1
		})
	}

	// PCs gain scars and roll on the wound table
	async _applyPCWound(newWound) {
		// get the value of all current wounds and add to the new wound
		const totalWounds = (this.system.attributes.Wounds.value || []).map(({ value }) => parseInt(value)).reduce(add, 0)
		const currentScars = parseInt(this.system.attributes.Scars.value)

		console.log(`Aegean | Actor::_applyPCWound => newWound=${newWound}, totalWounds=${totalWounds}`)

		const wound = await woundRoll(totalWounds, newWound)

		this.update({
			'system.attributes.Wounds.value': [ ...this.system.attributes.Wounds.value, wound],
			'system.attributes.Scars.value': currentScars + wound.value,
		})
	}

	// Legends roll on the wound table
	async _applyLegendWound(newWound) {
		// get the value of all current wounds and add to the new wound
		const totalWounds = (this.system.attributes.Wounds.value || []).map(({ value }) => parseInt(value)).reduce(add, 0)

		console.log(`Aegean | Actor::_applyLegendWound => newWound=${newWound}, totalWounds=${totalWounds}`)

		const wound = await woundRoll(totalWounds, newWound)

		this.update({
			'system.attributes.Wounds.value': [ ...this.system.attributes.Wounds.value, wound],
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
		const data = super.prepareData()
		console.log('Aegean | Actor::prepareData', data)
		return data
	}

	prepareDerivedData() {
		this.flags.aegean = this.getDerivedData()

		console.log('Aegean | Actor::prepareDerivedData', this.flags.aegean)
	}

	getDerivedData() {
		const flags = {}
		const RISK = parseInt(this.system.attributes.Risk.value)
		const ENDURANCE = parseInt(this.system.attributes.Endurance.value)

		// flags for PCs only
		if(isPC(this.type)) {
			flags.hasDivineHeritage = this.system.background.Heritage.value === 'Divine'
			
			flags.encumbrance = this.equipment
				.map(item => parseInt(item.system.equipment.Weight.value)).reduce(add, 0)

			flags.cumbersome = this.equipment.flatMap(
				({ properties }) => properties.filter(({ property }) => property.name === 'Cumbersome')
			).map(({ rating }) => parseInt(rating)).reduce(add, 0)

			flags.endurance = ENDURANCE - flags.cumbersome
			flags.vulnerable = RISK > flags.endurance
			flags.threshold = RISK === flags.endurance
			flags.encumbered = flags.encumbrance > parseInt(this.system.characteristics.Might.value) + AEGEAN.encumbrance		
		}

		// legends and champions need vulnerable and threshold data
		if(isLegend(this.type) || isChampion(this.type)) {
			flags.threshold = RISK === flags.endurance
			flags.endurance = ENDURANCE
			flags.vulnerable = RISK > flags.endurance
		}

		if(isChampion(this.type)) {
			flags.defeated = parseInt(this.system.stats.Wounds.value) <= 0
		}

		// manage group size and total endurance for minions
		if(isMinion(this.type)) {
			const SIZE = parseInt(this.system.group.Size.value)

			flags.endurance = ENDURANCE * SIZE
			flags.currentSize = Math.max(0, SIZE - Math.floor(Math.max(0, RISK - 1) / ENDURANCE))
			flags.defeated = RISK > flags.endurance
			flags.assistance = Math.clamped(flags.currentSize - 1, 0, 3)
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
