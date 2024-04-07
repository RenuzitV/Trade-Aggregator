// please help me refactor this piece of crap
//inittializing the main injecting div
const aggregator = document.createElement('div');
aggregator.id = 'aggregator';
aggregator.classList.add('results');
aggregator.style.position = 'fixed';
aggregator.style.top = '0';
aggregator.style.right = '0';
aggregator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
aggregator.style.padding = '10px';
aggregator.style.zIndex = '1000';
aggregator.textContent = 'Loading...';

if (document.body.querySelector('#aggregator')) {
    document.body.querySelector('#aggregator').remove();
}

document.body.appendChild(aggregator);

// Object to hold the counts and whisper button links of each account name
const accountData = {};

// Set to hold listing keys to avoid duplicates
const listings = new Set();

// Extract the logged-in user's account name, preventing aggregated search of own listings
const loggedInUserElement = document.querySelector('.loggedInStatus .profile-link a');
const loggedInUsername = loggedInUserElement ? loggedInUserElement.textContent : null;

function resetCountByListing(accountName, listingKey) {
    delete accountData[accountName][listingKey];
}

function resetCount(accountName) {
    delete accountData[accountName];
}

function resetAllCounts() {
    for (const accountName in accountData) {
        resetCount(accountName);
    }
    listings.clear();
}

const showButton = document.createElement('button');
showButton.id = 'show';
showButton.classList.add('btn', 'btn-default');
showButton.textContent = 'Show Aggregator';
showButton.style.position = 'fixed';
showButton.style.display = 'none';
showButton.style.top = '50px'; // 50 pixels below the top of the page
showButton.style.right = '0';
showButton.style.zIndex = '1001'; // Ensure it's above the aggregator

showButton.addEventListener('click', () => {
    aggregator.style.transform = 'translateX(0)';
    showButton.style.display = 'none';
});

if (document.body.querySelector('button#show')) {
    document.body.querySelector('button#show').remove();
}

document.body.appendChild(showButton);

function extractResultsDiv() {
    const results = document.body.querySelectorAll('.resultset');
    if (results.length === 0) {
        console.error('No results found.');
        aggregator.innerHTML = 'An error occurred. Please refresh the page and paste the script again.';
        return;
    }
    return results[0];
}

function extractResults() {
    const results = extractResultsDiv();
    return results.childNodes;
}

function initAggregator() {
    aggregator.innerHTML = `
        <button id="hide" class="btn btn-default">Hide</button>
        <button id="clear-all" class="btn btn-default">Clear All</button>
        <button id="refresh" class="btn btn-default">Refresh</button>
        <div class="table-responsive" style="margin: 5px">
            <table id="results-table" class="table">
                <thead>
                    <tr>
                        <th style="padding: 5px">Account Name</th>
                        <th style="padding: 5px">Amount Listed</th>
                        <th style="padding: 5px">Count</th>
                        <th style="padding: 5px">Total</th>
                        <th style="padding: 5px">Actions</th>
                    </tr>
                </thead>
                <tbody id="results-list">
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('hide').addEventListener('click', () => {
        aggregator.style.transform = 'translateX(100%)';
        showButton.style.display = 'block';
    });

    document.getElementById('clear-all').addEventListener('click', () => {
        resetAllCounts();
        updateAggregator();
    });

    document.getElementById('refresh').addEventListener('click', () => {
        // Reset the counts and reprocess the nodes to get the latest counts
        resetAllCounts();
        processNodes(extractResults());
        updateAggregator();
    });

    const resultList = document.createElement('div');
    resultList.id = 'results-list';
    aggregator.appendChild(resultList);

    const searchButton = document.querySelector('button.search-btn');
    searchButton.addEventListener('click', () => {
        console.log("search button clicked");
        resetAllCounts();
        updateAggregator();
    });

    processNodes(extractResults());
    updateAggregator();
}

// Function to update the floating div with the latest counts and whisper buttons
function updateAggregator() {
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = ''; // Clear previous results

    // Calculate total listings per account
    const accountsTotalListings = Object.entries(accountData).map(([account, listings]) => {
        const totalListings = Object.values(listings).reduce((sum, { count }) => sum + count, 0);
        return { account, totalListings, listings };
    });

    // Sort accounts by total listings and keep only the top 10
    const topAccounts = accountsTotalListings.sort((a, b) => b.totalListings - a.totalListings).slice(0, 10);


    // Iterate and display sorted accounts
    topAccounts.forEach(({ account, listings }) => {
        Object.entries(listings).forEach(([listingKey, data]) => {
            const row = document.createElement('tr');

            const accountCell = document.createElement('td');
            accountCell.textContent = account;
            accountCell.style.textAlign = 'center';
            accountCell.style.paddingLeft = '5px';
            accountCell.style.paddingRight = '5px';

            const amountListedCell = document.createElement('td');
            amountListedCell.textContent = listingKey;
            amountListedCell.style.textAlign = 'center';
            amountListedCell.style.paddingLeft = '5px';
            amountListedCell.style.paddingRight = '5px';

            const countCell = document.createElement('td');
            countCell.textContent = data.count;
            countCell.style.textAlign = 'center';
            countCell.style.paddingLeft = '5px';
            countCell.style.paddingRight = '5px';

            const totalCell = document.createElement('td');

            listingPrice = parseFloat(listingKey.split(" ")[0]);
            //get currency as the rest of the string
            listingCurrency = listingKey.split(" ").slice(1).join(" ");
            totalCell.textContent = `${listingPrice * data.count} ${listingCurrency}`;
            totalCell.style.textAlign = 'center';
            totalCell.style.paddingLeft = '5px';
            totalCell.style.paddingRight = '5px';

            const actionsCell = document.createElement('td');
            const whisperButton = document.createElement('button');
            whisperButton.classList.add('btn', 'btn-xs', 'btn-default');
            whisperButton.textContent = 'Whisper';
            whisperButton.style.marginLeft = '5px';
            whisperButton.addEventListener('click', () => {
                data.whisperButton.click();
            });

            const resetButton = document.createElement('button');
            resetButton.classList.add('btn', 'btn-xs', 'btn-default');
            resetButton.textContent = 'Clear';
            resetButton.style.marginLeft = '5px';
            resetButton.addEventListener('click', () => {
                delete accountData[account][listingKey];
                updateAggregator();
            });
            actionsCell.appendChild(whisperButton);
            actionsCell.appendChild(resetButton);
            actionsCell.style.paddingLeft = '5px';
            actionsCell.style.paddingRight = '5px';

            row.appendChild(accountCell);
            row.appendChild(amountListedCell);
            row.appendChild(countCell);
            row.appendChild(totalCell);
            row.appendChild(actionsCell);

            resultsList.appendChild(row);
        });
    });
}

// Flag to check if the aggregator has been updated
var updated = false;

// Function to process added nodes
function processNodes(addedNodes) {
    addedNodes.forEach(node => {
        if (node.parentElement && !node.parentElement.classList.contains('resultset')) return;

        if (listings.has(node)) {
            return; // Skip nodes that have already been processed
        }

        listings.add(node);

        const profileLink = node.querySelector ? node.querySelector('span.profile-link a') : null;
        const whisperButton = node.querySelector ? node.querySelector('button.direct-btn') : null;
        const priceField = node.querySelector ? node.querySelector('div.price span[data-field="price"]') : null;
        if (!priceField) return;
        const priceSpan = priceField.querySelector ? priceField.childNodes[3] : null;
        const currencySpan = priceField.querySelector ? priceField.childNodes[5] : null;
        const errorSpan = node.querySelector ? node.querySelector('span.error') : null;

        if (errorSpan) {
            return;
        }

        if (profileLink && whisperButton && priceSpan && currencySpan) {
            const accountName = profileLink.textContent.trim();
            if (accountName === loggedInUsername) return;

            const quantity = priceSpan.textContent.trim();
            const currencyType = currencySpan.textContent.trim();
            const listingKey = `${quantity} ${currencyType}`;

            if (!accountData[accountName]) {
                accountData[accountName] = {};
            }

            if (!accountData[accountName][listingKey]) {
                // console.log("Adding new listing for " + accountName + " " + listingKey);
                accountData[accountName][listingKey] = { count: 1, whisperButton: whisperButton };
            } else {
                // console.log("Incrementing count for " + accountName + " " + listingKey);
                accountData[accountName][listingKey].count += 1;
            }

            updated = true;
        }

    });
}

// observer to watch for changes in the DOM
const observer = new MutationObserver(mutations => {
    updated = false;
    mutations.forEach(mutation => {
        processNodes(mutation.addedNodes);
    });
    if (updated) {
        updateAggregator();
    }
});

// Configuration of the observer:
const config = { childList: true, subtree: true };

// Start observing the body for changes
observer.observe(document.body, config);

// Initial check in case the page has already loaded
initAggregator();
