import { poeButtonStyles } from '../poeButtons.style';
import { LitElement, html, css, TemplateResult, PropertyValueMap } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../elements/e-results-table';
import { ListingKey, Listing, extractResults, processNodes } from '../listings';

declare global {
	interface HTMLElementTagNameMap {
		'view-main': MainView;
	}
}

/**
 * @event hide-click
 * @event about-click
 */
@customElement('view-main')
export class MainView extends LitElement {
	#mutationObserver: MutationObserver;
	@state() accountData: Record<string, Record<ListingKey, Listing>> = Object.create({});
	@state() visitedListings: Set<HTMLElement> = new Set();
	@state() topListings: Listing[] = [];

	protected render(): TemplateResult {
		return html`<main id="main">
			<button @click=${this.#emitHideClick} id="hide" class="btn btn-default">Hide</button>
			<button @click=${this.#resetAllCounts} id="clear-all" class="btn btn-default">Clear All</button>
			<button @click=${this.#refresh} id="refresh" class="btn btn-default">Refresh</button>
			<button @click=${this.#emitAboutClick} id="about" class="btn btn-default">About</button>
			<e-results-table
				@whisper-click=${this.#onWhisperClick}
				@clear-click=${this.#onClearClick}
				.listings=${this.topListings}
			></e-results-table>
		</main>`;
	}

	constructor() {
		super();
		this.#mutationObserver = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				const rows = Array.from(mutation.addedNodes).filter(
					(node): node is HTMLElement => node instanceof HTMLElement
				);
				processNodes(rows, this.visitedListings, this.accountData);
				this.accountData = { ...this.accountData };
				this.visitedListings = new Set(this.visitedListings);
			});
		});
	}

	protected willUpdate(changed: PropertyValueMap<this>): void {
		if (changed.has('accountData') || changed.has('visitedListings')) {
			const accountsTotalListings = Object.entries(this.accountData).map(([account, listings]) => {
				const totalListings: number = Object.values(listings).reduce((sum, { count }) => sum + count, 0);
				return { account, totalListings, listings };
			});
			accountsTotalListings.sort((a, b) => b.totalListings - a.totalListings);

			// Sort accounts by total listings and keep only the top 10
			this.topListings = accountsTotalListings.slice(0, 10).flatMap(({ listings }) => Object.values(listings));
		}
	}

	connectedCallback(): void {
		super.connectedCallback();

		// Configuration of the observer:
		const config = { childList: true, subtree: true };

		// Start observing the body for changes
		this.#mutationObserver.observe(document.body, config);
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this.#mutationObserver.disconnect();
	}

	#refresh() {
		this.#resetAllCounts();
		processNodes(extractResults(), this.visitedListings, this.accountData);
		this.accountData = { ...this.accountData };
		this.visitedListings = new Set(this.visitedListings);
	}

	#onWhisperClick({ detail: listingId }: CustomEvent<string>) {
		const listing = this.topListings.find(listing => listing.id === listingId);
		if (listing) {
			listing.whispered = true;
			this.topListings = Array.from(this.topListings);
			listing.whisperButton.click();
		}
	}

	#onClearClick({ detail: listingId }: CustomEvent<string>) {
		this.topListings = this.topListings.filter(listing => listing.id !== listingId);
		this.topListings = Array.from(this.topListings);
	}

	#resetCount(accountName: string): void {
		delete this.accountData[accountName];
	}

	#resetAllCounts() {
		for (const accountName in this.accountData) {
			this.#resetCount(accountName);
		}
		this.visitedListings = new Set();
	}

	#emitHideClick() {
		this.dispatchEvent(new CustomEvent('hide-click'));
	}
	#emitAboutClick() {
		this.dispatchEvent(new CustomEvent('about-click'));
	}

	static styles = css`
		* {
			padding: 0;
			margin: 0;
			box-sizing: border-box;
		}

		${poeButtonStyles}
	`;
}
