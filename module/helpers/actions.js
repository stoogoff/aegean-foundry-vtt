
function Action(name, characteristic, skill = 'Melee', effect = () => {}) {
	this.name = name

	this.selection = () => {
		return {
			characteristic,
			skill,
		}
	}

	this.effect = effect
}

export default {
	defend: new Action('defend', 'Cool', 'Melee', (actor, result) => {
		actor.reduceRisk(result)
	}),
	disarm: new Action('disarm', 'Insight'),
	disengage: new Action('disengage', 'Reflexes'),
	misdirect: new Action('misdirect', 'Cunning', 'Survival'),
	pin: new Action('pin', 'Cunning'),
	taunt: new Action('taunt', 'Might', 'Manipulation'),
}
