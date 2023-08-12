
export default {
	props: {
		label: {
			type: String,
			required: true,
		},
		modelValue: {
			type: [String, Number],
			default: '',
		},
	},

	emits: ['update:modelValue'],

	methods: {
		updateModel(value) {
			this.$emit('update:modelValue', value)
		},
	},
}
