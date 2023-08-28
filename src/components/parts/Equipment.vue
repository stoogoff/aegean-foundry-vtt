<template>
	<section class="grid column-panel">
		<div>
			<h2>{{ $filters.localise("aegean.system.Equipment") }}</h2>
			<table>
				<thead>
					<tr>
						<th>{{ $filters.localise("aegean.system.Name") }}</th>
						<th>{{ $filters.localise("aegean.equipment.Availability") }}</th>
						<th>{{ $filters.localise("aegean.equipment.Price") }}</th>
						<th>{{ $filters.localise("aegean.equipment.Weight") }}</th>
						<th>{{ $filters.localise("aegean.equipment.Properties") }}</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(item, idx) in items"
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
			<box-input label="character.attributes.Standing.label" v-model="character.attributes.Standing.value" />
			<box-input label="character.equipment.Drakhmae.label" v-model="character.equipment.Drakhmae.value" />
			<box-input label="character.equipment.Encumbrance.label" v-model="character.equipment.Encumbrance.value" />
			<box-input label="character.equipment.AmmoLoads.label" v-model="character.equipment.AmmoLoads.value" />
			<box-input label="character.equipment.HerbalistDoses.label" v-model="character.equipment.HerbalistDoses.value" />
		</div>
	</section>
</template>
<script>

import Character from './character'

import BoxInput from '../inputs/BoxInput.vue'

export default {
	name: 'Equipment',

	mixins: [ Character ],

	components: {
		BoxInput,
	},

	computed: {
		items() {
			if(!this.character) return []
			if(!this.character.equipment) return []
			if(!this.character.equipment.items) return []

			return this.character.equipment.items
		}
	},
}

</script>
