// Global variables
let trades = [];
let currentPage = 1;
const rowsPerPage = 10;

// Function to display trades
function displayTrades() {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const tableBody = document.getElementById('tradeTableBody');
    tableBody.innerHTML = '';

    for (let i = startIndex; i < endIndex && i < trades.length; i++) {
        const trade = trades[i];
        const row = `
            <tr class="table-row-alternate">
                <td class="table-cell">${trade.entryDate}</td>
                <td class="table-cell">${trade.exitDate}</td>
                <td class="table-cell">${trade.type}</td>
                <td class="table-cell-right">${trade.entryPrice.toFixed(2)}</td>
                <td class="table-cell-right">${trade.exitPrice.toFixed(2)}</td>
                <td class="table-cell-right">${trade.positionSize.toFixed(2)}</td>
                <td class="table-cell-right">${trade.profitLoss.toFixed(2)}</td>
                <td class="table-cell">${trade.strategy}</td>
                <td class="table-cell-right">${trade.commission.toFixed(2)}</td>
                <td class="table-cell-right">${trade.netProfitLoss.toFixed(2)}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    }

    updatePaginationInfo();
}

// Function to update pagination info
function updatePaginationInfo() {
    const totalPages = getTotalPages();
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// Function to get total number of pages
function getTotalPages() {
    return Math.ceil(trades.length / rowsPerPage);
}

// Function to update trade table
function updateTradeTable() {
    displayTrades(); // This now includes updating the table and pagination
}

// Function to go to previous page
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayTrades();
    }
}

// Function to go to next page
function nextPage() {
    const totalPages = getTotalPages();
    if (currentPage < totalPages) {
        currentPage++;
        displayTrades();
    }
}

// Export functions and variables
export { trades, displayTrades, updateTradeTable, prevPage, nextPage, getTotalPages };