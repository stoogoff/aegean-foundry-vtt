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
<style>

.talent {
  border-bottom: 1px solid var(--grey-mid);
  margin-bottom: var(--spacing-4);
}
.talent:last-of-type {
  border-bottom: 0;
}

</style>
