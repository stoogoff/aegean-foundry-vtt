<template>
	<div class="form-input">
		<label>{{ $filters.localise(label) }}</label>
		<input type="text" :value="modelValue" @input="updateModel($event.target.value)" />
	</div>
</template>
<script>

import TextInput from './text-input'

export default {
	name: 'FormInput',
	mixins: [ TextInput ],
}

</script>
<style>

.aegean .form-input {
	display: flex;
	padding: var(--spacing-2) 0;
}

.aegean .form-input label {
	display: block;
	margin-top: var(--spacing-2);
	margin-right: var(--spacing);
	text-transform: uppercase;
	font-weight: bold;
	font-size: var(--font-mid);
	position: relative;
	top: var(--spacing-1);
}
.aegean .form-input input[type=text] {
	border-bottom: var(--border);
	padding: var(--spacing-1) var(--spacing-2) 0;
}

</style>
