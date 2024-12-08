// Extract the logged-in user's account name, preventing aggregated search of own listings
const loggedInUserElement = document.querySelector('.loggedInStatus .profile-link a');
const loggedInUsername = loggedInUserElement ? loggedInUserElement.textContent : null;

export type ListingKey = `${number}${string}`;
export type Listing = {
	listingKey: ListingKey;
	count: number;
	whisperButton: HTMLButtonElement;
	account: string;
	id: string;
	whispered: boolean;
};

export function processNodes(
	addedNodes: HTMLElement[],
	visitedListingsMut: Set<HTMLElement>,
	accountDataMut: Record<string, Record<ListingKey, Listing>>
): boolean {
	let updated = false;
	addedNodes.forEach(node => {
		if (node.parentElement && !node.parentElement.classList.contains('resultset')) return;

		if (visitedListingsMut.has(node)) {
			return; // Skip nodes that have already been processed
		}

		visitedListingsMut.add(node);

		const profileLink = node.querySelector ? node.querySelector<HTMLSpanElement>('span.profile-link a') : null;
		const whisperButton = node.querySelector ? node.querySelector<HTMLButtonElement>('button.direct-btn') : null;
		const priceField = node.querySelector ? node.querySelector('div.price span[data-field="price"]') : null;
		if (!priceField) return;
		const priceSpan = priceField.childNodes[3] as HTMLSpanElement | null;
		const currencySpan = priceField.childNodes[5] as HTMLSpanElement | null;
		const errorSpan = node.querySelector ? node.querySelector('span.error') : null;

		if (errorSpan) {
			return;
		}

		if (!profileLink || !priceSpan || !currencySpan) {
			return;
		}

		if (profileLink && whisperButton && priceSpan && currencySpan) {
			const accountName = profileLink.textContent?.trim() ?? '';
			if (accountName === loggedInUsername) return;

			const quantity = Number(priceSpan.textContent?.trim());
			const currencyType = currencySpan.textContent?.trim();
			const listingKey: ListingKey = `${quantity} ${currencyType}`;

			if (!accountDataMut[accountName]) {
				accountDataMut[accountName] = Object.create({});
			}

			if (!accountDataMut[accountName][listingKey]) {
				// console.log("Adding new listing for " + accountName + " " + listingKey);
				accountDataMut[accountName][listingKey] = {
					account: accountName,
					count: 1,
					whisperButton: whisperButton,
					listingKey,
					id: crypto.randomUUID(),
					whispered: false,
				};
			} else {
				// console.log("Incrementing count for " + accountName + " " + listingKey);
				accountDataMut[accountName][listingKey].count += 1;
			}

			updated = true;
		}
	});

	return updated;
}

export function extractResults(): HTMLElement[] {
	const results = document.body.querySelectorAll('.resultset');
	if (results.length === 0) {
		return [];
	}

	// Collect arrays of child nodes
	const childNodesArrays = Array.from(results).map(result => Array.from(result.childNodes));

	// Flatten the array of arrays into a single array
	const flattened = childNodesArrays.flat() as HTMLElement[];

	return flattened;
}
