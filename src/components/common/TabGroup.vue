<template>
	<div>
		<div class="tab-group">
			<ul>
				<li
					v-for="(tab, idx) in tabs"
					:key="`tab_${idx}`"
					class="tab-item"
					:class="{ active: tab === activeTab, disabled: tab.disabled }"
					@keypress.enter="activate(tab)"
					@keypress.space.prevent="activate(tab)"
					@click="activate(tab)"
					tabindex="0"
				>
					{{ $filters.localise(tab) }}
				</li>
			</ul>
		</div>
		<slot />
	</div>
</template>
<script>

import { nextTick } from 'vue'
import { activate } from './tab-controller'

export default {
	name: 'TabGroup',

	props: {
		active: {
			type: String,
			default: '',
		},
	},

	data() {
		return {
			activeTab: '',
		}
	},

	mounted() {
		nextTick(() => this.activate(this.active || this.tabs[0]))
	},

	computed: {
		tabs() {
			return this.$slots.default().map(vnode => vnode.props.title)
		},
	},

	methods: {
		activate(tab) {
			this.activeTab = tab
			activate(tab)
		},
	},
}

</script>
<style>

.aegean .tab-group {
  border-bottom: 1px solid black;
}
.aegean .tab-group ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.aegean .tab-item {
  color: #4B5563;
  cursor: pointer;
  display: inline-block;
  font-size: 12px;
  padding: 0.5rem 1rem;
  text-align: center;
  text-transform: uppercase;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}
.aegean .tab-item:hover {
  background-color: #E5E7EB;
  color: black;
}
.aegean .tab-item.active {
  background-color: black;
  color: white;
}
.aegean .tab-item.disabled {
  color: rgb(120,120,120);
}

</style>
