<template>
	<header class="character-info">
		<div>
			<img class="character-portrait" :src="actor.img" />
		</div>
		<div>
			<!-- TODO Aegean Logo -->
			<form-input label="aegean.character.Character" v-model="actor.name" />
			<form-input :label="character.background.Home.label" v-model="character.background.Home.value" />
			<div class="grid grid-cols-4">
				<box-input :label="character.attributes.Risk.label" v-model="character.attributes.Risk.value" />
				<box-input :label="character.attributes.Endurance.label" v-model="character.attributes.Endurance.value" />
				<box-input :label="character.attributes.Resolve.label" v-model="character.attributes.Resolve.value" />
				<box-input :label="character.attributes.Oracle.label" v-model="character.attributes.Oracle.value" />
			</div>
		</div>
	</header>
</template>

<script>

import Character from './character'

import BoxInput from '../inputs/BoxInput.vue'
import FormInput from '../inputs/FormInput.vue'

export default {
	name: 'HeaderSection',

	mixins: [ Character ],

	components: {
		BoxInput,
		FormInput,
	},
}
</script>

<style>

.aegean .character-info {
	display: grid;
	gap: var(--spacing-4);
	grid-template-columns: 200px auto;
	margin-bottom: var(--spacing-2);
}

.aegean .character-portrait {
	background-color: var(--grey-light);
}

</style>
