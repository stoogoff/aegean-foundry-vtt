<template>
	<section class="grid grid-cols-2">
		<div>
			<select-input
				:label="character.background.Heritage.label"
				:items="heritages"
				v-model="character.background.Heritage.value"
			/>
			<select-input
				:label="character.background.Parent.label"
				:items="parents"
				v-model="character.background.Parent.value"
				v-if="character.background.Heritage === 'Divine'"
			/>
			<select-input
				:label="character.background.Background.label"
				:items="backgrounds"
				v-model="character.background.Background.value"
			/>
			<multi-select-input
				:label="character.background.Careers.label"
				:items="careers"
				v-model="character.background.Careers.value"
			/>
			<multi-select-input
				:label="character.background.MysteryCults.label"
				:items="mysteryCults"
				v-model="character.background.MysteryCults.value"
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
