import { LitElement, html, css, TemplateResult, PropertyValueMap } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './views/view-main';
import './views/view-about';
import { LOCAL_STORAGE } from './storage';

declare global {
	interface HTMLElementTagNameMap {
		'app-root': AppRoot;
	}
}

@customElement('app-root')
export class AppRoot extends LitElement {
	@property({ type: Boolean, reflect: true }) open = LOCAL_STORAGE.aggregatorOpen.get();
	@property({ reflect: true }) currentView: 'main' | 'about' = 'main';

	protected render(): TemplateResult {
		return html`<div id="aggregator" class="aggregator results">
			${this.open
				? html`
						${this.currentView === 'main'
							? html`
									<view-main
										@about-click=${this.#onAboutClick}
										@hide-click=${this.#onHideClick}
									></view-main>
							  `
							: html`<view-about @close-click=${this.#onCloseAboutClick}></view-about>`}
				  `
				: html`
						<poe-button @click=${this.#onShowAggregatorClick} id="showAggregator">
							Show Aggregator
						</poe-button>
				  `}
		</div>`;
	}

	protected willUpdate(changed: PropertyValueMap<this>): void {
		if (changed.has('open')) {
			LOCAL_STORAGE.aggregatorOpen.set(this.open);
		}
	}

	#onAboutClick() {
		this.currentView = 'about';
	}
	#onCloseAboutClick() {
		this.currentView = 'main';
	}
	#onHideClick() {
		this.open = false;
	}
	#onShowAggregatorClick() {
		this.open = true;
	}

	static styles = css`
		* {
			padding: 0;
			margin: 0;
			box-sizing: border-box;
		}

		:host {
			position: fixed;
			top: 0;
			right: 0;
			background-color: rgba(0, 0, 0, 0.7);
			padding: 5px;
			z-index: 1000;
			transition: right 0.2s ease 0s;
			max-width: 600px;
		}

		.aggregator {
			position: relative;
		}

		#showAggregator {
			transition: right 0.2s ease 0s;
		}
	`;
}
