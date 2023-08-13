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
	border: 1px solid black;
}
.aegean .box-input label {
	text-transform: uppercase;
	background-color: black;
	color: white;
	display: block;
	padding: 0.25rem;
	text-align: center;
	line-height: 1;
	font-size: 16px;
	max-height: 20px;
}
.aegean .box-input input[type=text] {
	padding-top: 1rem;
	padding-bottom: 1rem;
	font-size: 30px;
	text-align: center;
}

</style>
