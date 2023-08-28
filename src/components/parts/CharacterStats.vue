<template>
	<section>
		<h2>{{ $filters.localise("aegean.system.Characteristics") }}</h2>
		<div class="grid grid-cols-5">
			<box-input
				v-for="ch in characteristics"
				:key="ch"
				:label="character.characteristics[ch].label"
				v-model="character.characteristics[ch].value"
			/>
		</div>
		<div class="grid column-panel">
			<div class="skills">
				<h2>{{ $filters.localise("aegean.system.Skills") }}</h2>
				<skill-input
					v-for="sk in skills"
					:key="sk"
					:label="character.skills[sk].label"
					v-model="character.skills[sk].value"
					:specialisations="[]"
				/>
			</div>
			<div class="box-column">
				<h2>{{ $filters.localise("aegean.system.Attributes") }}</h2>
				<box-input :label="character.attributes.Glory.label" v-model="character.attributes.Glory.value" />
				<box-input :label="character.attributes.Hubris.label" v-model="character.attributes.Hubris.value" />
				<box-input :label="character.attributes.XP.label" v-model="character.attributes.XP.value" />
				<box-input :label="character.attributes.Scars.label" v-model="character.attributes.Scars.value" />
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
