<template>
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
</template>

<script>

import BoxInput from '../input/BoxInput'
import FormInput from '../input/FormInput'
import Character from './character'

export default {
	name: 'Header',

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