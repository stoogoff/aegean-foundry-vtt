<template>
	<div>
		<div>
			<select-input :label="label" :items="items" v-model="selectedItem" />
			<button-action small @click="addItem" :disabled="!canAdd">Add</button-action>
		</div>
		<div class="grid grid-cols-3">
			<span
				v-for="(item, idx) in value"
				:key="`item_${idx}`"
				class="chip"
			>{{ item }}</span>
		</div>
	</div>
</template>
<script>

import Vue from 'vue'
import TextInput from './text-input'

export default Vue.component('MultiSelectInput', {
	mixins: [ TextInput ],

	props: {
		items: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			selectedItem: '',
		}
	},

	computed: {
		canAdd() {
			return !!this.selectedItem && this.value.indexOf(this.selectedItem) === -1
		},
	},

	methods: {
		addItem() {
			if(!this.selectedItem) return
			if(this.value.indexOf(this.selectedItem) !== -1) return

			this.$emit('input', [ ...this.value, this.selectedItem ])
			//this.updateModel([ ...this.selectedItems, this.selectedItem ])

			this.selectedItem = ''
		},
	},
})

</script>
<style>

.chip {
	background-color: #E5E7EB;
	padding: 0.25rem 0.5rem;
	display: inline-block;
	text-align: center;
}

</style>
