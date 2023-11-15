
import { createId } from './string.js'

export const WOUNDS = [
	{
		rollLow: 2,
		rollHigh: 4,
		text: 'aegean.wounds.NoEffect',
		effect: () => {},
	},
	{
		rollLow: 5,
		rollHigh: 6,
		text: 'aegean.wounds.Hubris',
		effect: () => {},
	},
	{
		rollLow: 7,
		rollHigh: 8,
		text: 'aegean.wounds.Characteristic',
		effect: () => {},
	},
	{
		rollLow: 9,
		rollHigh: 10,
		text: 'aegean.wounds.SkillCheckPenalty',
		effect: () => {},
	},
	{
		rollLow: 11,
		rollHigh: 11,
		text: 'aegean.wounds.SkillCheckDifficulty',
		effect: () => {},
	},
	{
		rollLow: 12,
		rollHigh: 12,
		text: 'aegean.wounds.Reaction',
		effect: () => {},
	},
	{
		rollLow: 13,
		rollHigh: 13,
		text: 'aegean.wounds.Maneuver',
		effect: () => {},
	},
	{
		rollLow: 14,
		rollHigh: 14,
		text: 'aegean.wounds.Stunned',
		effect: () => {},
	},
	{
		rollLow: 15,
		rollHigh: 15,
		text: 'aegean.wounds.Incapacitated',
		effect: () => {},
	},
	{
		rollLow: 16,
		rollHigh: Number.MAX_SAFE_INTEGER,
		text: 'aegean.wounds.Dying',
		effect: () => {},
	},
]

export const woundRoll = async (current, wound) => {
	const roll = await new Roll('1d10')

	roll.evaluate({ async: true })

	// roll.terms[0].results: array of { result: num, active: true } for each dice rolled
	const result = roll.terms[0].results[0].result + current + wound
	const output = WOUNDS.find(wound => result >= wound.rollLow && result <= wound.rollHigh)

	console.log(`Aegean | woundRoll => current=${current}, wound=${wound}, result=${result}, output`, output)

	return {
		id: createId(),
		penalty: output.text,
		effect: output.effect,
		value: wound,
		healed: false,
	}
}
