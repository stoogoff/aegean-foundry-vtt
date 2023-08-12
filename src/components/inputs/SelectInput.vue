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
			>{{ $filters.localise(value) }}</div>
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
			return item === this.value
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
<style scoped>

.select-input {
	display: flex;
	padding: 0.125rem 0;
}

.select-input label {
	display: block;
	margin-top: 0.5rem;
	margin-right: 0.125rem;
	font-weight: bold;
	font-size: 16px;
	white-space: nowrap;
}

.select-input > div {
	position: relative;
	width: 100%;
}

.select-trigger {
	border-bottom: 1px solid black;
	cursor: pointer;
	padding: 0.25rem 0.5rem 0;
	height: 32px;
	background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-down</title><path d="M5.84,9.59L11.5,15.25L17.16,9.59L16.45,8.89L11.5,13.84L6.55,8.89L5.84,9.59Z" /></svg>') right center no-repeat;
}
.select-trigger:focus {
	outline: 1px solid blue;
}

.select-dropdown {
	border: 1px solid black;
	border-top-width: 0;
	position: absolute;
	background-color: white;
	min-width: 150px;
	box-shadow: 3px 3px 10px rgba(0,0,0,0.3);
	z-index: 100;
}

.select-item {
	color: #4B5563;
	cursor: pointer;
	font-size: 14px;
	padding: 0.5rem 1rem;
	transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}
.select-item:hover {
	background-color: #E5E7EB;
	color: black;
}
.select-item.active {
	background-color: #E5E7EB;
	color: black;
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
