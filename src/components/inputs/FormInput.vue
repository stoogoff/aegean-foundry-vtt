<template>
	<div class="form-input">
		<label>{{ label | localise }}</label>
		<input type="text" :value="value" @input="$emit('input', $event.target.value)" />
	</div>
</template>
<script>

import TextInput from './text-input'

export default {
	name: 'FormInput',
	mixins: [ TextInput ],
}

</script>
<style scoped>

.form-input {
	display: flex;
	padding: 0.5rem 0;
}

.form-input label {
	display: block;
	margin-top: 0.5rem;
	margin-right: 0.125rem;
	text-transform: uppercase;
	font-weight: bold;
	font-size: 16px;
	position: relative;
	top: 0.25rem;
}
.form-input input[type=text] {
	border-bottom: 1px solid black;
	padding: 0.25rem 0.5rem 0;
	display: block;
	width: 100%;
}

</style>
