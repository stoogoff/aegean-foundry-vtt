<template>
	<div class="talent">
		<h3>{{ talent.title }}</h3>
		<p>{{ talent.description }}</p>
	</div>
</template>
<script>

export default {
	name: 'TalentPanel',

	props: {
		talent: {
			type: Object,
			required: true,
		},
	},
}

</script>
<style scoped>

.talent {
  border-bottom: 1px solid #9CA3AF;
  margin-bottom: 1rem;
}
.talent:last-of-type {
  border-bottom: 0;
}

</style>
