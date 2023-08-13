
import { CharacterSheet } from '../../dist/components.vue.es.js'
import { createApp } from '../lib/vue.esm-browser.js'
import { AEGEAN } from '../helpers/config.js'

export class AegeanActorSheet extends ActorSheet {

	constructor(...args) {
		super(...args)

		this.vueApp = null
		this.vueRoot = null
	}

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['aegean', 'sheet', 'actor'],
			template: 'systems/aegean/templates/actor/actor-character-sheet.html',
			width: 800,
			height: 600
		})
	}

	/** @override */
	get template() {
		return `systems/aegean/templates/actor/actor-${this.actor.type}-sheet.html`
	}

	/* -------------------------------------------- */

	/** @override */
	getData() {
		const context = super.getData()

		//context.actor = this.actor.toObject()
		//context.actor.id = context.actor.id ?? context.actor._id

		console.log('AEGEAN ActorSheet::getData', context)

		return context
	}

	render(force=false, options={}) {
		const context = this.getData()

		// Render the vue application after loading. We'll need to destroy this
		// later in the this.close() method for the sheet.
		if (!this.vueApp) {
			this.vueApp = createApp({
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
						// We can't just replace the object outright without destroying the
						// reactivity, so this instead updates the keys individually.
						for (let key of Object.keys(this.context)) {
							this.context[key] = newContext[key]
						}
					}
				}
			})
			this.vueApp.config.globalProperties.$config = AEGEAN
			this.vueApp.config.globalProperties.$filters = {
				localise(value) {
					return game.i18n.localize(value)
				}
			}
		}
		// Otherwise, perform update routines on the app.
		else {
			// Pass new values from this.getData() into the app.
			this.vueRoot.updateContext(context)
			this.activateVueListeners($(this.form), true)
			return
		}

		this._render(force, options).catch(err => {
			err.message = `An error occurred while rendering ${this.constructor.name} ${this.appId}: ${err.message}`
			console.error(err)
			this._state = Application.RENDER_STATES.ERROR
		})
		// Run Vue's render, assign it to our prop for tracking.
		.then(rendered => {
			this.vueRoot = this.vueApp.mount(`[data-appid='${this.appId}'] .vue`)
			this.activateVueListeners($(this.form), false)
		})

		this.object.apps[this.appId] = this
		return this
	}

	async close(options={}) {
		this.vueApp.unmount()
		this.vueApp = null
		this.vueRoot = null
		return super.close(options)
	}

	/**
	 * Apply drag events to items (powers and equipment).
	 * @param {jQuery} html
	 */
	 _dragHandler(html) {
		let dragHandler = event => this._onDragStart(event)
		html.find('.item[data-draggable="true"]').each((i, li) => {
			li.setAttribute('draggable', true)
			li.addEventListener('dragstart', dragHandler, false)
		})
	}

	/**
	 * Activate additional listeners on the rendered Vue app.
	 * @param {jQuery} html
	 * @param {boolean} repeat
	 *	 Used to require logic to execute only once.
	 */
	activateVueListeners(html, repeat = false) {
		if (!this.options.editable) {
			html.find('input,select,textarea').attr('disabled', true)
			return
		}

		this._dragHandler(html)

		// Place one-time executions after this line.
		if (repeat) return

		html.find('.editor-content[data-edit]').each((i, div) => this._activateEditor(div))
	}

	// Exit early, place listeners in vue components.
	activateListeners(html) {
		return
	}
}
