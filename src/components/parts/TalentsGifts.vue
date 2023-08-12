<template>
	<section>
		<h2>{{ $filters.localise("aegean.system.GiftsTalents") }}</h2>
		<talent-panel v-for="talent in character.talents" :key="talent.title" :talent="talent" />
	</section>
</template>
<script>

import Character from './character'

import TalentPanel from './TalentPanel.vue'

export default {
	name: 'TalentsGifts',

	mixins: [ Character ],

	components: {
		TalentPanel,
	},
}

</script>
