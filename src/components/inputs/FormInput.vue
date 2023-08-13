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
	padding: 0.5rem 0;
}

.aegean .form-input label {
	display: block;
	margin-top: 0.5rem;
	margin-right: 0.125rem;
	text-transform: uppercase;
	font-weight: bold;
	font-size: 16px;
	position: relative;
	top: 0.25rem;
}
.aegean .form-input input[type=text] {
	border-bottom: 1px solid black;
	padding: 0.25rem 0.5rem 0;
}

</style>
