import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../elements/poe-button';

declare global {
	interface HTMLElementTagNameMap {
		'view-about': AboutView;
	}
}

/**
 * @event close-click
 */
@customElement('view-about')
export class AboutView extends LitElement {
	protected render(): TemplateResult {
		return html`<div id="aboutDiv" class="aboutDiv">
			<poe-button @click=${this.#emitCloseClick} id="hide-about">Close</poe-button>
			<h3>Path Of Exile Trade Aggregator</h3>
			<br />
			<span>
				This extension aggregates the all listings under the same account name and displays a whisper button for
				each account name in the Path Of Exile trade site.
			</span>
			<br />
			<br />
			<span> Changelog: </span>
			<br />
			<ul>
				<li>Minor UI tweaks</li>
				<li>"Whisper" now becomes "Whispered" after clicking</li>
				<li>Alternate row color for better readability</li>
				<li>Added an about section</li>
				<li>Added a Kofi link for donation. Thank you for your support!</li>
			</ul>
			<br />
			<a href="https://ko-fi.com/H2H4WPVOX" target="_blank">
				<img
					height="36"
					style="border:0px;height:36px;"
					src="https://storage.ko-fi.com/cdn/kofi2.png?v=3"
					alt="Buy Me a Coffee at ko-fi.com"
				/>
			</a>
		</div>`;
	}

	#emitCloseClick() {
		this.dispatchEvent(new CustomEvent('close-click'));
	}

	static styles = css`
		* {
			padding: 0;
			margin: 0;
			box-sizing: border-box;
		}

		.aboutDiv {
			background-color: rgba(0, 0, 0, 1);
			padding: 5px;
		}

		#hide-about {
			margin: 5px;
		}

		ul {
			display: block;
			list-style-type: disc;
			margin-block-start: 1em;
			margin-block-end: 1em;
			margin-inline-start: 0px;
			margin-inline-end: 0px;
			padding-inline-start: 40px;
		}
	`;
}
