<template>
	<section class="grid grid-cols-2">
		<div>
			<select-input
				label="aegean.character.Heritage"
				:items="heritages"
				v-model="character.background.Heritage"
			/>
			<select-input
				label="aegean.character.Parent"
				:items="parents"
				v-model="character.background.Parent"
				v-if="character.background.Heritage === 'Divine'"
			/>
			<select-input
				label="aegean.character.Background"
				:items="backgrounds"
				v-model="character.background.Background"
			/>
			<multi-select-input
				label="Careers"
				:items="careers"
				v-model="character.background.Careers"
			/>
			<multi-select-input
				label="Mystery Cults"
				:items="mysteryCults"
				v-model="character.background.MysteryCults"
			/>
		</div>
		<div>
			<div class="boxed">
				<h3>Relationships</h3>
				<div
					v-for="(relationship, idx) in character.relationships"
					:key="`relationship_${idx}`"
				>
					{{ relationship.name }}
				</div>
			</div>
			Favour
			Disfavour
		</div>
	</section>
</template>
<script>

import Character from './character'

import SelectInput from '../inputs/SelectInput.vue'
import MultiSelectInput from '../inputs/MultiSelectInput.vue'

export default {
	name: 'Background',

	mixins: [ Character ],

	components: {
		MultiSelectInput,
		SelectInput,
	},

	computed: {
		heritages() {
			return this.$config.heritages
		},

		backgrounds() {
			return this.$config.backgrounds
		},

		parents() {
			return this.$config.parents
		},

		careers() {
			return this.$config.careers
		},

		mysteryCults() {
			return this.$config.mysteryCults
		},
	}
}

</script>
