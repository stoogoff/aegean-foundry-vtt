
export default {
	props: {
		label: {
			type: String,
			required: true,
		},
		value: {
			type: [String, Number],
			default: '',
		},
	},
}
