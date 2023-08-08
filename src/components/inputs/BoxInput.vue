<template>
	<div class="box-input">
		<input type="text" :value="value" @input="$emit('input', $event.target.value)" />
		<label>{{ label }}</label>
	</div>
</template>

<script>

import Vue from 'vue'
import TextInput from './text-input'

export default Vue.component('BoxInput', {
	mixins: [ TextInput ],
})

</script>

<style scoped>

.box-input {
	border: 1px solid black;
}
.box-input label {
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
.box-input input[type=text] {
	margin-top: 0.25rem;
	font-size: 30px;
	display: block;
	width: 100%;
	text-align: center;
}

</style>
