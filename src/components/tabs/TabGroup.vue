<template>
	<div>
		<div class="tab-group">
			<ul>
				<li
					v-for="(tab, idx) in tabs"
					:key="`tab_${idx}`"
					class="tab-item"
					:class="{ active: tab.active, disabled: tab.disabled }"
					@keypress.enter="activate(tab)"
					@keypress.space.prevent="activate(tab)"
					@click="activate(tab)"
					tabindex="0"
				>
					{{ tab.title }}
				</li>
			</ul>
		</div>
		<slot />
	</div>
</template>
<script>

import Vue from 'vue'

export default Vue.component('TabGroup', {
	props: {
		active: {
			type: String,
			default: '',
		},
	},

	data() {
		return {
			tabs: []
		}
	},

	mounted() {
		this.tabs = this.$children

		if(this.active) {
			this.tabs.forEach(tab => {
				if(tab.title === this.active) {
					tab.active = true
				}
			})
		}
		else {
			this.tabs[0].active = true
		}
	},

	methods: {
		activate(tab) {
			if(tab.disabled) return

			this.tabs.forEach(child => child.active = child === tab)
		},
	},
})

</script>
<style scoped>

.tab-group {
	border-bottom: 1px solid black;
}
.tab-group ul {
	list-style-type: none;
	margin: 0;
	padding: 0;
}

.tab-item {
	color: #4B5563;
	cursor: pointer;
	display: inline-block;
	font-size: 12px;
	padding: 0.5rem 1rem;
	text-align: center;
	text-transform: uppercase;
	transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}
.tab-item:hover {
	background-color: #E5E7EB;
	color: black;
}
.tab-item.active {
	background-color: black;
	color: white;
}
.tab-item.disabled {
	color: rgb(120,120,120);
}

</style>
