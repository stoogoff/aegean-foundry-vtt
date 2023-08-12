<template>
	<section class="grid grid-cols-2">
		<div>
			<select-input
				label="aegean.character.Heritage"
				:items="$config.Heritages"
				v-model="character.background.Heritage"
			/>
			<select-input
				label="aegean.character.Parent"
				:items="$config.Parents"
				v-model="character.background.Parent"
				v-if="character.background.Heritage === 'Divine'"
			/>
			<select-input
				label="aegean.character.Background"
				:items="$config.Backgrounds"
				v-model="character.background.Background"
			/>
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
