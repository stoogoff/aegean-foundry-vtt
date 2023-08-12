<template>
	<section v-show="active" class="tab-panel">
		<slot />
	</section>
</template>
<script>

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
			active: false
		}
	}
}

</script>
