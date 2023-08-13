<template>
	<article class="character-sheet">
		<header-section :actor="context.actor" />
		<tab-group>
			<tab-panel title="aegean.ui.Stats">
				<character-stats :actor="context.document" />
			</tab-panel>
			<tab-panel title="aegean.ui.Combat">
				<p>Weapons, defence, combat moves / summary, wounds</p>
			</tab-panel>
			<tab-panel title="aegean.ui.Equipment">
				<p>Equipment here</p>
				<!-- equipment :actor="context.document" /-->
			</tab-panel>
			<tab-panel title="aegean.ui.Talents">
				<talents-gifts :actor="context.document" />
			</tab-panel>
			<tab-panel title="aegean.ui.Background">
				<background :actor="context.document" />
			</tab-panel>
		</tab-group>
		<button class="btn" @click="test">TEST</button>
		<div>
			<div>context.actor.name = {{ context.actor.name }}</div>
			<div>context.actor.system.characteristics.Might = {{ context.actor.system.characteristics.Might }}</div>
		</div>
	</article>
</template>
<script>

import TabGroup from './common/TabGroup.vue'
import TabPanel from './common/TabPanel.vue'

import Background from './parts/Background.vue'
import HeaderSection from './parts/HeaderSection.vue'
import CharacterStats from './parts/CharacterStats.vue'
import Equipment from './parts/Equipment.vue'
import TalentsGifts from './parts/TalentsGifts.vue'

export default {
	name: 'CharacterSheet',

	props: {
		context: {
			type: Object,
			required: true,
		},	
	},

	components: {
		TabGroup,
		TabPanel,

		Background,
		HeaderSection,
		CharacterStats,
		Equipment,
		TalentsGifts,
	},

	methods: {
		test() {
			console.log(this.context)
		}
	},
}

</script>
<style>

.character-sheet {
	background-color: white;
}

</style>
