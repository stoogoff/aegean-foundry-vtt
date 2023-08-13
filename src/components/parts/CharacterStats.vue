<template>
	<section>
		<h2>{{ $filters.localise("aegean.system.Characteristics") }}</h2>
		<div class="grid grid-cols-5">
			<box-input
				v-for="ch in characteristics"
				:key="ch"
				:label="`aegean.characteristics.${ch}`"
				v-model="character.characteristics[ch]"
			/>
		</div>
		<div class="grid column-panel">
			<div class="skills">
				<h2>{{ $filters.localise("aegean.system.Skills") }}</h2>
				<skill-input
					v-for="sk in skills"
					:key="sk"
					:label="`aegean.skills.${sk}`"
					v-model="character.skills[sk]"
					:specialisations="[]"
				/>
			</div>
			<div class="box-column">
				<h2>{{ $filters.localise("aegean.system.Attributes") }}</h2>
				<box-input label="aegean.attributes.Glory" v-model="character.attributes.Glory" />
				<box-input label="aegean.attributes.Hubris" v-model="character.attributes.Hubris" />
				<box-input label="aegean.attributes.XP" v-model="character.attributes.XP" />
				<box-input label="aegean.attributes.Scars" v-model="character.attributes.Scars" />
			</div>
		</div>
	</section>
</template>
<script>

import Character from './character'

import BoxInput from '../inputs/BoxInput.vue'
import SkillInput from '../inputs/SkillInput.vue'

export default {
	name: 'CharacterStats',

	mixins: [ Character ],

	components: {
		BoxInput,
		SkillInput,
	},

	computed: {
		characteristics() {
			return this.$config.characteristics
		},

		skills() {
			return this.$config.skills
		},
	},
}

</script>
