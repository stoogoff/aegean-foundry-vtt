<template>
	<section class="grid column-panel">
		<div>
			<h2>{{ "aegean.system.Equipment" | localise }}</h2>
			<table>
				<thead>
					<tr>
						<th>{{ "aegean.system.Name" | localise }}</th>
						<th>{{ "aegean.equipment.Availability" | localise }}</th>
						<th>{{ "aegean.equipment.Price" | localise }}</th>
						<th>{{ "aegean.equipment.Weight" | localise }}</th>
						<th>{{ "aegean.equipment.Properties" | localise }}</th>
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
			<box-input label="aegean.attributes.Standing" v-model="character.attributes.Standing" />
			<box-input label="aegean.system.Drakhmae" v-model="character.equipment.Drakhmae" />
			<box-input label="aegean.attributes.Encumbrance" v-model="character.equipment.Encumbrance" />
			<box-input label="aegean.equipment.Ammo" v-model="character.equipment.AmmoLoads" />
			<box-input label="aegean.equipment.Doses" v-model="character.equipment.HerbalistDoses" />
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
}

</script>
