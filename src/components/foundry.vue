<template>
	<div class="m-32" style="max-width: 800px;">
		<article class="character-sheet">
			<header>
				<div>
					<img src="https://placehold.co/200x200" />
				</div>
				<div>
					<!-- TODO Aegean Logo -->
					<form-input label="Character" v-model="character.background.Name" />
					<form-input label="Home" v-model="character.background.Home" />
					<div class="grid grid-cols-4">
						<box-input label="Risk" v-model="character.attributes.Risk" />
						<box-input label="Endurance" v-model="character.attributes.Endurance" />
						<box-input label="Resolve" v-model="character.attributes.Resolve" />
						<box-input label="Oracle" v-model="character.attributes.Oracle" />
					</div>
				</div>
			</header>
			<tab-group>
				<tab-panel title="Stats">
					<h2>Characteristics</h2>
					<div class="grid grid-cols-5">
						<box-input
							v-for="ch in characteristics"
							:key="ch"
							:label="ch"
							v-model="character.characteristics[ch]"
						/>
					</div>
					<div class="grid skill-panel">
						<div class="skills">
							<h2>Skills</h2>
							<skill-input
								v-for="sk in skills"
								:key="sk"
								:label="sk"
								v-model="character.skills[sk]"
								:specialisations="character.specialisations[sk] || []"
							/>
						</div>
						<div class="box-column">
							<h2>Attributes</h2>
							<box-input label="Glory" v-model="character.attributes.Glory" />
							<box-input label="Hubris" v-model="character.attributes.Hubris" />
							<box-input label="Standing" v-model="character.attributes.Standing" />
							<box-input label="XP" v-model="character.attributes.XP" />
							<box-input label="Scars" v-model="character.attributes.Scars" />
						</div>
					</div>
				</tab-panel>
				<tab-panel title="Combat">
					Weapons, defence, combat moves / summary, wounds
				</tab-panel>
				<tab-panel title="Equipment">
					Equipment, encumbrance, drakhmae doses ammo
				</tab-panel>
				<tab-panel title="Talents">
					<h2>Talents and Gifts</h2>
					<div v-for="talent in character.talents" :key="talent.title">
						<h3>{{ talent.title }}</h3>
						<p>{{ talent.description }}</p>
					</div>
					<button class="btn">Add</button>
				</tab-panel>
				<tab-panel title="Background">
					Heritage, background, careers, fate. If there's room all of the back of the sheet
				</tab-panel>
			</tab-group>
		</article>
	</div>
</template>
<script>

export default {
	name: 'FoundryPage',

	data() {
		return {
			input: '',
			character: {
				background: {
					Name: 'Akhilles',
					Home: 'Vlokis',
					Background: 'Noble',
					Heritage: 'Divine',
					Parent: 'Aphrodite',
				},
				characteristics: {
					Might: 2,
					Reflexes: 2,
					Cool: 2,
					Insight: 2,
					Cunning: 2,
				},
				skills: {
					Accuracy: 0,
					Athletics: 0,
					Awareness: 0,
					Brawl: 0,
					Craft: 0,
					Diplomacy: 0,
					Knowledge: 0,
					Lore: 0,
					Manipulation: 0,
					Medicine: 0,
					Melee: 0,
					Perform: 0,
					Ride: 0,
					Survival: 0,
					Vigour: 0,
				},
				specialisations: {
					Diplomacy: ['Intimidation', 'Charm'],
					Vigour: ['Recovery'],
				},
				attributes: {
					Endurance: 0,
					Glory: 0,
					Hubris: 0,
					Oracle: 0,
					Resolve: 0,
					Risk: 0,
					Scars: 0,
					Standing: 0,
					XP: 0,
				},
				talents: [
					{
						title: 'Deadeye',
						description: 'Whenever you make an Aim Maneuver you gain +2D instead of +1D. All other Aim rules apply.',
					},
				]
			},
		}
	},

	computed: {
		characteristics() {
			return [
				'Might',
				'Reflexes',
				'Cool',
				'Insight',
				'Cunning',
			]
		},

		skills() {
			return [
				'Accuracy',
				'Athletics',
				'Awareness',
				'Brawl',
				'Craft',
				'Diplomacy',
				'Knowledge',
				'Lore',
				'Manipulation',
				'Medicine',
				'Melee',
				'Perform',
				'Ride',
				'Survival',
				'Vigour',
			]
		},
	},
}

</script>
<style scoped>

.character-sheet header {
	display: grid;
	gap: 1rem;
	grid-template-columns: 200px auto;
}

.flex {
	display: flex;
}

.grid {
	display: grid;
	gap: 1rem;
}
.grid-cols-3 {
	grid-template-columns: repeat(3, minmax(0, 1fr));
}
.grid-cols-4 {
	grid-template-columns: repeat(4, minmax(0, 1fr));
}
.grid-cols-5 {
	grid-template-columns: repeat(5, minmax(0, 1fr));
}

.skill-panel {
	grid-template-columns: 612px auto;
}

.skills {
	border: 1px solid black;
	padding: 0.5rem;
	margin-top: 1rem;
}

.box-column {
	margin-top: 1rem;
}
.box-column .box-input {
	margin-bottom: 1rem;
}

.btn {
	text-transform: uppercase;
	background-color: black;
	border: 1px solid #9CA3AF;
	border-radius: 0.2rem;
	color: #D1D5DB;
	font-weight: bold;
	padding: 0.25rem 1rem;
	transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
.btn:hover {
	background-color: #374151;
	border-color: black;
	color: white;
}

</style>
