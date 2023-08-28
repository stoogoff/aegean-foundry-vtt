<template>
	<div>
		<div>
			<select-input :label="label" :items="items" v-model="selectedItem" />
			<button-action small @click="addItem" :disabled="!canAdd">Add</button-action>
		</div>
		<div class="grid grid-cols-3">
			<span
				v-for="(item, idx) in modelValue"
				:key="`item_${idx}`"
				class="chip"
			>{{ item }}</span>
		</div>
	</div>
</template>
<script>

import ButtonAction from '../common/ButtonAction.vue'
import SelectInput from './SelectInput.vue'
import TextInput from './text-input'

export default {
	mixins: [ TextInput ],

	components: {
		ButtonAction,
		SelectInput,
	},

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
			return !!this.selectedItem && this.modelValue.indexOf(this.selectedItem) === -1
		},
	},

	methods: {
		addItem() {
			if(!this.selectedItem) return
			if(this.modelValue.indexOf(this.selectedItem) !== -1) return

			this.updateModel([ ...this.modelValue, this.selectedItem ])

			this.selectedItem = ''
		},
	},
}

</script>
<style>

.aegean .chip {
	background-color: var(--grey-light);
	padding: var(--spacing-1) var(--spacing-2);
	display: inline-block;
	text-align: center;
	font-size: var(--font-sm);
}

</style>
