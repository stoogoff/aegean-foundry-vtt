
export const isEquipment = type => type === 'weapon' || type === 'equipment' || type === 'armour'
export const canHaveProperties = type => type === 'attack' || isEquipment(type)

export const isLegend = type => type === 'legend'
export const isChampion = type => type === 'champion'
export const isMinion = type => type === 'minion'
export const isAdversary = type => isLegend(type) || isChampion(type) || isMinion(type)
export const isCity = type => type === 'polis'
export const isPC = type => type === 'character'

export const parseObject = (input, scope, debug = false) => {
	const parts = input.trim().split(/\./g)
	let buffer = scope

	for(let i = 0, ilen = parts.length; i < ilen; ++i) {
		if(parts[i] === 'this') continue

		buffer = buffer[parts[i]]

		if(buffer === undefined) break
	}

	if(buffer === undefined && debug) {
		throw new Error(`${ input } not found in scope`, scope)
	}

	if(buffer === undefined) {
		buffer = ''
	}

	return buffer
}

export const UNARMED_STRIKE = {
	_id: 'brawling',
	name: 'Brawling',
	shortProperties: [],
	properties: [],
	system: {
		equipment: {
			Properties: {
				label: 'aegean.equipment.Properties',
				value: [],
			},
		},
		stats: {
			Skill: {
				label: 'aegean.system.Skill',
				value: 'Brawl',
			},
			Reach: {
				label: 'aegean.combat.Reach',
				value: '0–1',
			},
			Range: {
				label: 'aegean.combat.Range',
				value: 'Engaged',
			},
			Damage: {
				label: 'aegean.combat.Damage',
				value: 2,
			},
		},
	},
}
