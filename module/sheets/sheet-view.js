
import { CharacterSheet } from '../../dist/components.vue.es.js'
import { createApp } from '../lib/vue.esm-browser.js'
import { AEGEAN } from '../helpers/config.js'

export class SheetView {
	constructor(context) {
		this.root = null
		this.app = createApp({
			data() {
				return {
					context,
				}
			},
			components: {
				CharacterSheet,
			},
			methods: {
				updateContext(newContext) {
					for(let key of Object.keys(this.context)) {
						this.context[key] = newContext[key]
					}
				}
			}
		})

		this.app.config.globalProperties.$config = AEGEAN

		// it'd be good to move these elsewhere and load them in
		this.app.config.globalProperties.$filters = {
			localise(value) {
				return game.i18n.localize(value)
			}
		}
	}

	mount(appId) {
		this.root = this.app.mount(`[data-appid='${appId}'] .vue`)
	}

	unmount() {
		this.app.unmount()
		this.app = null
		this.root = null
	}

	update(context) {
		if(this.root) {
			this.root.updateContext(context)
		}
	}
}
