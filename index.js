let account = null;
let trades = [];
let cumulativeBalances = [];

// Global variables
let currentPage = 1;
const rowsPerPage = 10;

/// Easily adjustable variables
const BUFFER_PERCENT = 20; // Buffer percentage (10 means 10%)
const GREEN_COLOR = 'rgba(75, 192, 192, 0.2)'; // Light green
const RED_COLOR = 'rgba(255, 99, 132, 0.2)'; // Light red
const LINE_COLOR = 'rgba(75, 192, 192, 1)'; // Solid green for the line


//location of Other scripts
const accountHtml = './Account/account_setup.html';




document.getElementById("newAccountBtn").addEventListener("click", function () {
    window.location.href = accountHtml;
});

document.getElementById("loadDataBtn").addEventListener("click", function () {
    document.getElementById("loadFile").click();
});

function showMainContent() {
    document.getElementById("initialOptions").classList.add("hidden");
    document.getElementById("mainContent").classList.remove("hidden");
}

// Load account data on page load
window.addEventListener('load', function () {
    const accountData = localStorage.getItem('tradingAccount');
    if (accountData) {
        account = JSON.parse(accountData);
        trades = JSON.parse(localStorage.getItem('tradingTrades') || '[]');
        calculateCumulativeBalances();
        updateAccountDisplay();
        updateTradeTable();
        updateChart();
        showMainContent();
        displayTrades();
    }
});

// Calculate cumulative balances
function calculateCumulativeBalances() {
    cumulativeBalances = [account.startingBalance];
    let runningBalance = account.startingBalance;
    trades.forEach(trade => {
        runningBalance += trade.netProfitLoss;
        cumulativeBalances.push(runningBalance);
    });
    account.currentBalance = runningBalance;
}


// Update account balance
function updateAccountBalance(trade) {
    if (account) {
        account.currentBalance += trade.netProfitLoss;
        cumulativeBalances.push(account.currentBalance);
        updateAccountDisplay();
        updateChart();
        // Save updated data to localStorage
        saveDataToLocalStorage();
    }
}

// Save data to localStorage
function saveDataToLocalStorage() {
    localStorage.setItem('tradingAccount', JSON.stringify(account));
    localStorage.setItem('tradingTrades', JSON.stringify(trades));
}

// Record trade
document.getElementById("tradeForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const trade = {
        entryDate: document.getElementById("entryDate").value,
        exitDate: document.getElementById("exitDate").value,
        type: document.getElementById("tradeType").value,
        entryPrice: parseFloat(document.getElementById("entryPrice").value),
        exitPrice: parseFloat(document.getElementById("exitPrice").value),
        positionSize: parseFloat(document.getElementById("positionSize").value),
        profitLoss: parseFloat(document.getElementById("profitLoss").value),
        strategy: document.getElementById("strategy").value,
        commission: parseFloat(document.getElementById("commission").value)
    };

    // Calculate net profit/loss
    trade.netProfitLoss = trade.profitLoss - trade.commission;

    trades.push(trade);
    updateAccountBalance(trade);
    updateTradeTable();
    this.reset(); // Reset the form
});

// Display trades
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

function updatePaginationInfo() {
    const totalPages = Math.ceil(trades.length / rowsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayTrades();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(trades.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayTrades();
    }
});


// Update account balance display
function updateAccountDisplay() {
    if (account) {
        document.getElementById("displayStartingBalance").textContent = account.startingBalance.toFixed(2);
        document.getElementById("displayCurrentBalance").textContent = account.currentBalance.toFixed(2);
        document.getElementById("displayTradingPair").textContent = account.tradingPair || "N/A";
    } else {
        // Reset displayed values if account is null
        document.getElementById("displayStartingBalance").textContent = "0.00";
        document.getElementById("displayCurrentBalance").textContent = "0.00";
        document.getElementById("displayTradingPair").textContent = "N/A";
    }
}

// Update trade table
function updateTradeTable() {
    const tbody = document.getElementById("tradeTableBody");
    tbody.innerHTML = "";
    trades.forEach(trade => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = trade.entryDate;
        row.insertCell(1).textContent = trade.exitDate;
        row.insertCell(2).textContent = trade.type;
        row.insertCell(3).textContent = trade.entryPrice.toFixed(5);
        row.insertCell(4).textContent = trade.exitPrice.toFixed(5);
        row.insertCell(5).textContent = trade.positionSize.toFixed(2);
        row.insertCell(6).textContent = trade.profitLoss.toFixed(2);
        row.insertCell(7).textContent = trade.strategy;
        row.insertCell(8).textContent = trade.commission.toFixed(2);
        row.insertCell(9).textContent = trade.netProfitLoss.toFixed(2);
    });
    displayTrades(); // Update pagination
}


// Custom Plugin
const customBackgroundPlugin = {
    id: 'customBackground',
    beforeDatasetsDraw(chart) {
        if (account) {
            const startingBalance = account.startingBalance; // Access the startingBalance from the account
            const { ctx, chartArea: { top, bottom }, scales: { x, y } } = chart;
            const startX = x.getPixelForValue(0);
            const startY = y.getPixelForValue(startingBalance);

            cumulativeBalances.forEach((balance, index) => {
                if (index === 0) return; // Skip the first point (Start)

                const prevBalance = cumulativeBalances[index - 1];
                const currX = x.getPixelForValue(index);
                const prevX = x.getPixelForValue(index - 1);
                const currY = y.getPixelForValue(balance);
                const prevY = y.getPixelForValue(prevBalance);

                ctx.save();
                ctx.beginPath();

                // Move to the previous point
                ctx.moveTo(prevX, prevY);

                // Line to the current point
                ctx.lineTo(currX, currY);

                // Check if the line segment crosses the starting balance
                if ((prevBalance < startingBalance && balance > startingBalance) ||
                    (prevBalance > startingBalance && balance < startingBalance)) {

                    // Calculate the intersection point with the starting balance
                    const intersectionX = prevX + (currX - prevX) * ((startingBalance - prevBalance) / (balance - prevBalance));
                    const intersectionY = startY;

                    // Draw down to the starting balance (intersection point)
                    ctx.lineTo(intersectionX, intersectionY);

                    // Close the path and fill the area below the starting balance (red)
                    ctx.lineTo(prevX, startY);
                    ctx.closePath();
                    ctx.fillStyle = prevBalance > startingBalance ? GREEN_COLOR : RED_COLOR;
                    ctx.fill();

                    // Start a new path for the area above the starting balance (green)
                    ctx.beginPath();
                    ctx.moveTo(intersectionX, intersectionY);
                    ctx.lineTo(currX, currY);
                    ctx.lineTo(currX, startY);
                    ctx.lineTo(intersectionX, startY);
                    ctx.closePath();
                    ctx.fillStyle = balance > startingBalance ? GREEN_COLOR : RED_COLOR;
                    ctx.fill();
                } else {
                    // No crossing, just fill the entire segment
                    ctx.lineTo(currX, startY);
                    ctx.lineTo(prevX, startY);
                    ctx.closePath();
                    ctx.fillStyle = balance > startingBalance ? GREEN_COLOR : RED_COLOR;
                    ctx.fill();
                }

                ctx.restore();
            });
        } else {
            console.error('Account or starting balance not defined');
        }
    }
};

function updateChart() {
    const ctx = document.getElementById('balanceChart').getContext('2d');
    if (window.balanceChart && typeof window.balanceChart.destroy === "function") {
        window.balanceChart.destroy();
    }

    const labels = ['Start', ...Array.from({ length: trades.length }, (_, i) => i + 1)];
    const startingBalance = account.startingBalance;

    // Calculate min and max values for dynamic scaling
    const minBalance = Math.min(...cumulativeBalances);
    const maxBalance = Math.max(...cumulativeBalances);
    const dataRange = maxBalance - minBalance;
    const buffer = dataRange * (BUFFER_PERCENT / 100);

    window.balanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Balance',
                data: cumulativeBalances,
                borderColor: LINE_COLOR,
                borderWidth: 2,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Trades'
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Balance'
                    },
                    min: minBalance - buffer,
                    max: maxBalance + buffer
                }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            return `Balance: $${context.parsed.y.toFixed(2)}`;
                        }
                    }
                },
                legend: {
                    display: false
                },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: startingBalance,
                            yMax: startingBalance,
                            borderColor: 'rgba(0, 0, 0, 0.5)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                content: 'Starting Balance',
                                enabled: true,
                                position: 'left'
                            }
                        }
                    }
                }
            }
        },
        plugins: [customBackgroundPlugin]
    });
}

// Save data to JSON
document.getElementById("saveButton").addEventListener("click", function () {
    const data = JSON.stringify({ account, trades });
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trading_journal_data.json";
    a.click();
});


// Load data from JSON
document.getElementById("loadFile").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = JSON.parse(e.target.result);
            account = data.account;
            trades = data.trades;
            calculateCumulativeBalances();
            updateAccountDisplay();
            updateTradeTable();
            updateChart();
            saveDataToLocalStorage();
            showMainContent();
        };
        reader.readAsText(file);
    }
});

// Clear all data
document.getElementById("clearDataBtn").addEventListener("click", function () {
    const confirmClear = confirm("Are you sure you want to clear all data?");
    if (confirmClear) {
        localStorage.clear();
        account = null;
        trades = [];
        cumulativeBalances = [];
        updateAccountDisplay();
        updateTradeTable();
        updateChart();
        alert("All data has been cleared.");
        location.reload();
    }
});


// Modal functionality
const openModalButton = document.getElementById("openModalBtn");
const modal = document.getElementById("modal");
const closeModalButton = document.querySelector(".close-button");

openModalButton.onclick = function () {
    modal.classList.remove("hidden");
}

closeModalButton.onclick = function () {
    modal.classList.add("hidden");
}