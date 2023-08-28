<template>
	<button
		class="btn"
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

.aegean .btn {
	text-transform: uppercase;
	background-color: var(--invert-bg);
	border: 1px solid var(--grey-mid);
	border-radius: 0.2rem;
	color: var(--invert-fg);
	font-weight: bold;
	transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
	display: inline-block;
}
.aegean .btn:hover {
	background-color: var(--grey-dark);
	border-color: var(--invert-bg);
	color: var(--invert-fg-hover);
}

.aegean .btn.disabled, .aegean .btn.disabled:hover {
	cursor: not-allowed;
	background-color: var(--grey-light);
	color: var(--grey-mid);
	border-color: var(--grey-mid);
	box-shadow: none;
}

.aegean .btn.enabled {
	cursor: pointer;
}

.aegean .btn.full-width {
	display: block;
	width: 100%;
}
.aegean .btn.small {
	font-size: var(--font-sm);
	padding: var(--spacing) var(--spacing-2);
}
.aegean .btn.medium {
	font-size: var(--font-mid);
	padding: var(--spacing-1) var(--spacing-4);
}

</style>
