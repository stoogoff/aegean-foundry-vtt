
export default {
	props: {
		actor: {
			type: Object,
			required: true,
		}
	},

	mounted() {
		console.log(this.actor)
	},

	computed: {
		character() {
			return this.actor.system;
		},
	},
}
