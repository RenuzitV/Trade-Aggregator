import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

declare global {
	interface HTMLElementTagNameMap {
		'poe-button': PoeButtonElement;
	}
}

@customElement('poe-button')
export class PoeButtonElement extends LitElement {
	/** The button's size. */
	@property({ reflect: true }) size: 'small' | 'medium' = 'medium';
	/** Disables the button. */
	@property({ type: Boolean, reflect: true }) disabled = false;
	/**
	 * The type of button. Note that the default value is `button` instead of `submit`, which is opposite of how native
	 * `<button>` elements behave. When the type is `submit`, the button will submit the surrounding form.
	 */
	@property() type: 'button' | 'submit' | 'reset' = 'button';
	/** The button's theme variant. */
	@property({ reflect: true }) variant: 'default' = 'default';

	@query('.button') button!: HTMLButtonElement;

	/** Removes focus from the button. */
	blur() {
		this.button.blur();
	}

	/** Sets focus on the button. */
	focus(options?: FocusOptions) {
		this.button.focus(options);
	}

	#onBlur() {
		this.button.blur();
	}

	#onFocus() {
		this.button.focus();
	}

	protected render(): TemplateResult {
		return html`<button
			class=${classMap({
				button: true,
				'button--small': this.size === 'small',
				'button--medium': this.size === 'medium',
				'button--default': this.variant === 'default',
				'button--disabled': this.disabled,
			})}
			tabindex=${this.disabled ? '-1' : '0'}
			type=${this.type}
			@focus=${this.#onFocus}
			@blur=${this.#onBlur}
		>
			<slot></slot>
		</button>`;
	}

	static styles = css`
		* {
			padding: 0;
			margin: 0;
			box-sizing: border-box;
		}

		:host {
			display: inline-block;
			position: relative;
			width: auto;
			cursor: pointer;
		}

		.button {
			display: inline-block;
			margin-bottom: 0;
			font-weight: normal;
			text-align: center;
			vertical-align: middle;
			touch-action: manipulation;
			cursor: pointer;
			background-image: none;
			border: 1px solid #000;
			white-space: nowrap;
			padding: 6px 12px;
			font-size: 13px;
			line-height: 1.45;
			border-radius: 0px;
			-webkit-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
		}

		.button--default {
			color: #ddd;
			background-color: #222;
			border-color: #444;
		}

		.button--small {
			padding: 1px 5px;
			font-size: 12px;
			line-height: 1.5;
			border-radius: 0px;
		}

		.button--default:focus,
		.button--default.focus {
			color: #ddd;
			background-color: #090909;
			border-color: #040404;
		}

		.button--default:hover,
		.button--default:active {
			color: #ddd;
			background-color: #090909;
			border-color: #252525;
		}

		.button--default:active {
			background-image: none;
		}

		.button--disabled {
			opacity: 0.5;
			cursor: not-allowed;
			background-color: #222;
			border-color: #444;
		}

		/* When disabled, prevent mouse events from bubbling up from children */
		.button--disabled * {
			pointer-events: none;
		}
	`;
}
