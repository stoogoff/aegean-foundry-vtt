
import SheetView from './sheet-view.js'

export class AegeanActorSheet extends ActorSheet {

	constructor(...args) {
		super(...args)

		this.sheetView = null
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
	/*getData() {
		const context = super.getData()

		//context.actor = this.actor.toObject()
		//context.actor.id = context.actor.id ?? context.actor._id

		console.log('AEGEAN ActorSheet::getData', context)

		return context
	}*/

	render(force = false, options = {}) {
		const context = this.getData()

		if(!this.sheetView) {
			this.sheetView = new SheetView(context)
		}
		else {
			this.sheetView.update(context)
			this.activateVueListeners($(this.form), true)

			return
		}

		this._render(force, options).catch(err => {
			console.error(err)

			err.message = `An error occurred while rendering ${this.constructor.name} ${this.appId}: ${err.message}`
			this._state = Application.RENDER_STATES.ERROR
		})
		.then(rendered => {
			this.sheetView.mount(this.appId)
			this.activateVueListeners($(this.form), false)
		})

		this.object.apps[this.appId] = this

		return this
	}

	async close(options={}) {
		this.sheetView.unmount()
		this.sheetView = null

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
