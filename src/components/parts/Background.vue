<template>
	<section class="grid grid-cols-2">
		<div>
			<select-input label="aegean.character.Heritage" :items="heritages" v-model="character.background.Heritage" />
			<select-input
				label="aegean.character.Parent"
				:items="parents"
				v-model="character.background.Parent"
				v-if="character.background.Heritage === 'Divine'"
			/>
			<select-input label="aegean.character.Background" :items="backgrounds" v-model="character.background.Background" />
		</div>
		<div>
			Col
		</div>
	</section>
</template>
<script>

import Character from './character'

import SelectInput from '../inputs/SelectInput.vue'

export default {
	name: 'Background',

	mixins: [ Character ],

	components: {
		SelectInput,
	},
}

</script>
