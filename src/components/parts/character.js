
export default {
	props: {
		actor: {
			type: Object,
			required: true,
		}
	},

	computed: {
		character() {
			return this.actor.data;
		}
	},
}
