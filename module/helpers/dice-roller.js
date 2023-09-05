
import { AEGEAN } from './config.js'
import { add } from './list.js'

export const roll = async (dice, difficulty) => {
	let roll = await new Roll(`${dice}d10`)

	roll.evaluate({ async: true })

	// roll.terms[0].results: array of { result: num, active: true } for each dice rolled
	const result = roll.terms[0].results.map(({ result }) => ({
		result: result,
		success: result >= AEGEAN.dice.success,
		bonus: result >= AEGEAN.dice.bonus,
	}))

	const output = {
		result,
		successes: Math.max(0, result.map(({ success }) => success).reduce(add, 0) - difficulty),
		bonuses: result.map(({ bonus }) => bonus).reduce(add, 0),
	}

	console.log(`Aegean | roll => dice='${dice}', difficulty=${difficulty}`, output)

	return output
}
