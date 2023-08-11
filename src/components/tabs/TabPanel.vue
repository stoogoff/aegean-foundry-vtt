<template>
	<section v-show="active" class="tab-panel">
		<slot />
	</section>
</template>
<script>

import Vue from 'vue'

export default Vue.component('TabPanel', {
	props: {
		title: {
			type: String,
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			active: false
		}
	}
})

</script>
