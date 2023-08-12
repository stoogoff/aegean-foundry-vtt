<template>
	<header>
		<div>
			<img src="https://placehold.co/200x200" />
		</div>
		<div>
			<!-- TODO Aegean Logo -->
			<form-input label="aegean.character.Character" v-model="character.background.Name" />
			<form-input label="aegean.character.Home" v-model="character.background.Home" />
			<div class="grid grid-cols-4">
				<box-input label="aegean.attributes.Risk" v-model="character.attributes.Risk" />
				<box-input label="aegean.attributes.Endurance" v-model="character.attributes.Endurance" />
				<box-input label="aegean.attributes.Resolve" v-model="character.attributes.Resolve" />
				<box-input label="aegean.attributes.Oracle" v-model="character.attributes.Oracle" />
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

<style scoped>

header {
	display: grid;
	gap: 1rem;
	grid-template-columns: 200px auto;
	margin-bottom: 0.5rem;
}

</style>
