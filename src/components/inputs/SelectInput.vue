<template>
	<div class="select-input">
		<label>{{ $filters.localise(label) }}</label>
		<div>
			<div
				class="select-trigger"
				tabindex="0"
				@click="toggleActive"
				@keypress.enter="toggleActive"
				@keypress.space.prevent="toggleActive"
			>{{ $filters.localise(modelValue) }}</div>
			<transition
				name="select"
				@enter="start"
				@after-enter="end"
				@before-leave="start"
				@after-leave="end"
			>
				<div class="select-dropdown" v-show="active">
					<div
						v-for="(item, idx) in items"
						:key="idx"
						@click="select(item)"
						@keypress.enter="select(item)"
						@keypress.space.prevent="select(item)"
						class="select-item"
						:class="{
							'active': isSelected(item)
						}"
						tabindex="0"
					>
						{{ item }}
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>
<script>

import { nextTick } from '../../../module/lib/vue.esm-browser.js'
import TextInput from './text-input'

export default {
	name: 'TextInput',

	mixins: [ TextInput ],

	props: {
		items: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			active: false,
			suppressClose: false,
		}
	},

	mounted() {
		document.addEventListener('click', () => {
			nextTick(() => {
				if(!this.suppressClose) {
					this.active = false
				}

				this.suppressClose = false
			})
		})
	},

	methods: {
		toggleActive() {
			this.active = !this.active

			if(this.active) {
				this.suppressClose = true
			}
		},

		select(item) {
			this.updateModel(item)
			this.active = false
		},

		isSelected(item) {
			return item === this.modelValue
		},

		start(el) {
			el.style.height = el.scrollHeight + 'px'
		},

		end(el) {
			el.style.height = ''
		},
	},
}

</script>
<style>

.aegean .select-input {
	display: flex;
	padding: var(--spacing) 0;
}

.aegean .select-input label {
	display: block;
	margin-top: var(--spacing-2);
	margin-right: var(--spacing);
	font-weight: bold;
	font-size: var(--font-mid);
	white-space: nowrap;
}

.aegean .select-input > div {
	position: relative;
	width: 100%;
}

.aegean .select-trigger {
	border-bottom: var(--border);
	cursor: pointer;
	padding: var(--spacing-1) var(--spacing-2) 0;
	height: 32px;
	background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-down</title><path d="M5.84,9.59L11.5,15.25L17.16,9.59L16.45,8.89L11.5,13.84L6.55,8.89L5.84,9.59Z" /></svg>') right center no-repeat;
}
.aegean .select-trigger:hover {
	background-color: var(--input-hover-bg);
}
.aegean .select-trigger:focus {
	outline: var(--input-focus-border);
}

.aegean .select-dropdown {
	border: var(--border);
	border-top-width: 0;
	position: absolute;
	background-color: var(--base-bg);
	min-width: 150px;
	box-shadow: 3px 3px 10px rgba(0,0,0,0.3);
	z-index: 100;
}

.aegean .select-item {
	color: var(--grey-dark);
	cursor: pointer;
	font-size: var(--font-sm);
	padding: var(--spacing-2) var(--spacing-4);
	transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}
.aegean .select-item:hover {
	background-color: var(--grey-light);
	color: var(--base-fg);
}
.aegean .select-item.active {
	background-color: var(--grey-light);
	color: var(--base-fg);
	font-weight: bold;
}

.select-enter-active, .select-leave-active {
	will-change: height, opacity;
	transition: height 0.5s ease, opacity 0.5s ease;
	overflow: hidden;
}

.select-enter, .select-leave-to {
	height: 0 !important;
	opacity: 0;
}

</style>
