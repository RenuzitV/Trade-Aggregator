import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Listing } from '../listings';
import { classMap } from 'lit/directives/class-map.js';
import './poe-button';

declare global {
	interface HTMLElementTagNameMap {
		'e-results-table': ResultsTableElement;
	}
}

/**
 * @event whisper-click - emits listing id CustomEvent<string>
 * @event clear-click - emits listing id CustomEvent<string>
 */
@customElement('e-results-table')
export class ResultsTableElement extends LitElement {
	@property({ type: Array }) listings: Array<Listing> = [];

	protected render(): TemplateResult {
		return html`<div class="table-responsive" style="margin: 5px">
			<table id="results-table" class="table">
				<thead>
					<tr>
						<th class="thead-cell">Account Name</th>
						<th class="thead-cell">Amount Listed</th>
						<th class="thead-cell">Count</th>
						<th class="thead-cell">Total</th>
						<th class="thead-cell">Actions</th>
					</tr>
				</thead>
				<tbody id="results-list">
					${this.listings.map(({ account, listingKey, count, whispered, id }) => {
						const listingPrice = Number.parseFloat(listingKey.split(' ')[0]);
						//get currency as the rest of the string
						const listingCurrency = listingKey.split(' ').slice(1).join(' ');

						return html`
							<tr class=${classMap({ whispered: whispered })}>
								<td class="text-cell">${account}</td>
								<td class="text-cell">${listingKey}</td>
								<td class="text-cell">${count}</td>
								<td class="text-cell">${listingPrice * count} ${listingCurrency}</td>
								<td class="actions-cell">
									<poe-button
										size="small"
										.disabled=${whispered}
										@click=${() => this.#emitWhisperClick(id)}
									>
										${whispered ? 'Whispered' : 'Whisper'}
									</poe-button>
									<poe-button size="small" @click=${() => this.#emitClearClick(id)}>
										Clear
									</poe-button>
								</td>
							</tr>
						`;
					})}
				</tbody>
			</table>
		</div>`;
	}

	#emitWhisperClick(listingId: string) {
		this.dispatchEvent(new CustomEvent('whisper-click', { detail: listingId }));
	}

	#emitClearClick(listingId: string) {
		this.dispatchEvent(new CustomEvent('clear-click', { detail: listingId }));
	}

	static styles = css`
		* {
			padding: 0;
			margin: 0;
			box-sizing: border-box;
		}

		#results-table {
			border-spacing: 0 0.4em;
			border-collapse: separate;
		}

		.actions-cell {
			display: flex;
			justify-content: center;
			padding-left: 5px;
			padding-right: 5px;
		}

		.text-cell {
			text-align: center;
			padding-left: 5px;
			padding-right: 5px;
		}

		.action-button {
			margin-left: 2px;
			margin-right: 2px;
		}

		.thead-cell {
			padding: 5px;
		}

		tbody tr:nth-child(even) {
			background-color: rgba(50, 50, 50, 0.7);
		}
	`;
}
