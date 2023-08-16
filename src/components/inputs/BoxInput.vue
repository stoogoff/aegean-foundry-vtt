<template>
	<div class="box-input">
		<input type="text" :value="modelValue" @input="updateModel($event.target.value)" />
		<label>{{ $filters.localise(label) }}</label>
	</div>
</template>
<script>

import TextInput from './text-input'

export default {
	name: 'BoxInput',
	mixins: [ TextInput ],
}

</script>
<style>

.aegean .box-input {
	border: var(--border);
}
.aegean .box-input label {
	text-transform: uppercase;
	background-color: var(--invert-bg);
	color: var(--invert-fg);
	display: block;
	padding: var(--spacing-1);
	text-align: center;
	line-height: 1;
	font-size: var(--font-md);
	max-height: 20px;
}
.aegean .box-input input[type=text] {
	padding-top: var(--spacing-4);
	padding-bottom: var(--spacing-4);
	font-size: 30px;
	text-align: center;
}

</style>
