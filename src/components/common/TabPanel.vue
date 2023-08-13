<template>
	<section v-show="active" class="tab-panel">
		<slot />
	</section>
</template>
<script>

import { register } from './tab-controller'

export default {
	name: 'TabPanel',

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
			active: false,
		}
	},


	mounted() {
		register(active => {
			this.active = active === this.title
		})
	},
}

</script>
<style>

.aegean .tab-panel {
	padding-top: var(--spacing-4);
	padding-bottom: var(--spacing-4);
}

</style>
