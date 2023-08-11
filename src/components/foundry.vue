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
					<div class="grid column-panel">
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
							<box-input label="XP" v-model="character.attributes.XP" />
							<box-input label="Scars" v-model="character.attributes.Scars" />
						</div>
					</div>
				</tab-panel>
				<tab-panel title="Combat">
					Weapons, defence, combat moves / summary, wounds
				</tab-panel>
				<tab-panel title="Equipment">
					<div class="grid column-panel">
						<div>
							<h2>Equipment</h2>
							<table>
								<thead>
									<tr>
										<th>Name</th>
										<th>Availability</th>
										<th>Price</th>
										<th>Weight</th>
										<th>Properties</th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="(item, idx) in character.equipment.items"
										:key="`item_${idx}`"
									>
										<td>{{ item.title }}</td>
										<td>{{ item.availability }}</td>
										<td class="text-right">{{ item.price }}</td>
										<td class="text-right">{{ item.weight | fraction }}</td>
										<td>{{ (item.properties || []) | join }}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="box-column">
							<box-input label="Standing" v-model="character.attributes.Standing" />
							<box-input label="Drakhmae" v-model="character.equipment.Drakhmae" />
							<box-input label="Encumbrance" v-model="character.equipment.Encumbrance" />
							<box-input label="Ammo" v-model="character.equipment.AmmoLoads" />
							<box-input label="Doses" v-model="character.equipment.HerbalistDoses" />
						</div>
					</div>
				</tab-panel>
				<tab-panel title="Talents">
					<h2>Talents and Gifts</h2>
					<div v-for="talent in character.talents" :key="talent.title" class="talent">
						<h3>{{ talent.title }}</h3>
						<p>{{ talent.description }}</p>
					</div>
					<button class="btn">Add</button>
				</tab-panel>
				<tab-panel title="Background">
					<p>Heritage, background, careers, fate. If there's room all of the back of the sheet</p>

					<div class="grid grid-cols-2">
						<div>
							<select-input label="Heritage" :items="heritages" v-model="character.background.Heritage" />
							<select-input
								label="Divine Parent"
								:items="parents"
								v-model="character.background.Parent"
								v-if="character.background.Heritage === 'Divine'"
							/>
							<select-input label="Background" :items="backgrounds" v-model="character.background.Background" />
						</div>
						<div>
							Col
						</div>
					</div>
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
			backgrounds: [
				'Criminal',
				'Farmer',
				'Herder',
				'Hunter',
				'Merchant',
				'Noble',
				'Priest',
				'Soldier',
			],
			heritages: [
				'Divine',
				'Mortal',
			],
			parents: [
				'Aphrodite',
				'Apollo',
				'Ares',
				'Demeter',
				'Hephaestos',
				'Hermes',
				'Poseidon',
				'Zeus',
			],
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
					Craft: 3,
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
					{
						title: 'Deadeye',
						description: 'Whenever you make an Aim Maneuver you gain +2D instead of +1D. All other Aim rules apply.',
					},
				],
				equipment: {
					Drakhmae: 3,
					Encumbrance: 3, // needs to be computed
					AmmoLoads: 2,
					HerbalistDoses: 2,
					items: [
						{
							title: 'Rich Clothing',
							availability: 'Rare',
							weight: 0,
							price: 2,
							properties: [ 'Rich 1' ]
						},
						{
							title: 'Salpinx',
							availability: 'Uncommon',
							weight: 0.5,
							price: 1,
						},
					]
				},
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
	margin-bottom: 0.5rem;
}

.flex {
	display: flex;
}

.grid {
	display: grid;
	gap: 1rem;
}
.grid-cols-2 {
	grid-template-columns: repeat(2, minmax(0, 1fr));
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

.column-panel {
	grid-template-columns: 612px auto;
}

.text-right {
	text-align: right;
}
.text-left {
	text-align: left;
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

.talent {
	border-bottom: 1px solid #9CA3AF;
	margin-bottom: 1rem;
}
.talent:last-of-type {
	border-bottom: 0;
}

table {
	width: 100%;
}

</style>
