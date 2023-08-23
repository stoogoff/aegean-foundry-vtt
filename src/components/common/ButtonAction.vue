<template>
	<button
		class="btn border font-sans font-bold uppercase text-sm text-center mr-1 mb-1 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150"
		:class="{
			'full-width': block,
			'outlined': outlined,
			'small': small,
			'medium': !small,
			'disabled': disabled,
			'enabled': !disabled,
		}"
		:disabled="disabled"
		@click="$emit('click')">
		<slot />
	</button>
</template>
<script>

export default {
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		outlined: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: '',
		},
		block: {
			type: Boolean,
			default: false,
		},
		small: {
			type: Boolean,
			default: false,
		},
	},
}

</script>
<style>

.aegean .btn.disabled {
	@apply cursor-default shadow-none hover:shadow-none;
}
.aegean .btn.enabled {
	@apply hover:shadow-lg cursor-pointer;
}

.aegean .btn.full-width {
	@apply block w-full;
}
.aegean .btn.small {
	@apply px-3 py-1 text-xs;
}
.aegean .btn.medium {
	@apply px-6 py-3;
}

</style>
