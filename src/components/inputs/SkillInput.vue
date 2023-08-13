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
	margin-top: var(--spacing-2);
	margin-right: var(--spacing);
	font-weight: bold;
	font-size: var(--font-mid);
	position: relative;
	top: var(--spacing-1);
}
.aegean .skill input[type=text] {
	border-bottom: 1px solid black;
	padding: var(--spacing-1) var(--spacing-2) 0;
	text-align: right;
}
.aegean ul.specialisations {
	list-style-type: none;
	margin: var(--spacing-1) 0 0 0;
	padding: 0;
}
.aegean ul.specialisations li {
	display: inline-block;
	padding: var(--spacing) var(--spacing-1);
	margin-right: var(--spacing-1);
	background-color: rgb(200,200,200);
}
.aegean ul.specialisations li:last-child {
	margin-right: 0;
}

</style>
