<template>
	<div class="skill-input grid">
		<div class="skill">
			<label>{{ $filters.localise(label) }}</label>
			<input type="text" :value="modelValue" @input="updateModel($event.target.value)" />
		</div>
		<ul class="specialisations">
			<li
				v-for="spec in specialisations"
				:key="spec"
			>{{ spec }}</li>
		</ul>
	</div>
</template>
<script>

import TextInput from './text-input'

export default {
	name: 'SkillInput',

	mixins: [ TextInput ],

	props: {
		specialisations: {
			type: Array,
			default: [],
		},
	}
}

</script>
<style>

.aegean .skill-input {
	grid-template-columns: 300px auto;
}

.aegean .skill {
	display: flex;
}
.aegean .skill label {
	display: block;
	margin-top: 0.5rem;
	margin-right: 0.125rem;
	font-weight: bold;
	font-size: 16px;
	position: relative;
	top: 0.25rem;
}
.aegean .skill input[type=text] {
	border-bottom: 1px solid black;
	padding: 0.25rem 0.5rem 0;
	text-align: right;
}
.aegean ul.specialisations {
	list-style-type: none;
	margin: 0.25rem 0 0 0;
	padding: 0;
}
.aegean ul.specialisations li {
	display: inline-block;
	padding: 0.125rem 0.25rem;
	margin-right: 0.25rem;
	background-color: rgb(200,200,200);
}
.aegean ul.specialisations li:last-child {
	margin-right: 0;
}

</style>
