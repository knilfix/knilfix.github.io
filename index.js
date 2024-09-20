let account = null;
let trades = [];
let cumulativeBalances = [];
//location of Other scripts
const accountHtml = './Account/account_setup.html'

// Corrected variable name

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
        cumulativeBalances = [account.startingBalance]; // Initialize with starting balance
        updateAccountDisplay();
        updateTradeTable();
        updateChart(); // Initial chart update
        showMainContent();
    }
});

// Update account balance
function updateAccountBalance(trade) {
    if (account) {
        account.currentBalance += trade.netProfitLoss;
        cumulativeBalances.push(account.currentBalance);
        updateAccountDisplay();
        updateChart(); // Update chart after balance change
        // Save updated data to localStorage
        localStorage.setItem('tradingAccount', JSON.stringify(account));
        localStorage.setItem('tradingTrades', JSON.stringify(trades));
    }
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
}

// Update chart
function updateChart() {
    const ctx = document.getElementById('balanceChart').getContext('2d');
    if (window.balanceChart && typeof window.balanceChart.destroy === "function") {
        window.balanceChart.destroy();
    }

    // Create labels for each trade (including the starting point)
    const labels = ['Start', ...trades.map((_, index) => `Trade ${index + 1}`)];

    window.balanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cumulative Balance',
                data: cumulativeBalances,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.1 // Slight curve to the line
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Trades'
                    }
                },
                y: {
                    beginAtZero: false, // Allow the chart to start from the initial balance
                    title: {
                        display: true,
                        text: 'Balance'
                    }
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
                    display: true,
                    position: 'top'
                }
            }
        }
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
            cumulativeBalances = [account.startingBalance]; // Reset cumulative balances
            trades.forEach(trade => {
                // Calculate net profit/loss and update cumulative balances
                trade.netProfitLoss = trade.profitLoss - trade.commission;
                account.currentBalance += trade.netProfitLoss;
                cumulativeBalances.push(account.currentBalance);
            });
            updateAccountDisplay();
            updateTradeTable();
            updateChart(); // Update chart after loading new data
            // Update localStorage
            localStorage.setItem('tradingAccount', JSON.stringify(account));
            localStorage.setItem('tradingTrades', JSON.stringify(trades));
            showMainContent();
        };
        reader.readAsText(file);
    }
});

// Clear all data
document.getElementById("clearDataBtn").addEventListener("click", function () {
    const confirmClear = confirm("Are you sure you want to clear all data?");
    if (confirmClear) {
        localStorage.clear(); // Clear local storage
        account = null; // Reset account variable
        trades = []; // Reset trades array
        cumulativeBalances = []; // Reset cumulative balances

        // Update display and table
        updateAccountDisplay(); // Update display to reflect cleared data
        updateTradeTable(); // Clear trade table

        // Alert and refresh
        alert("All data has been cleared.");
        location.reload(); // Refresh the page
    }
});

const openModalButton = document.getElementById("openModalBtn");
const modal = document.getElementById("modal");
const closeModalButton = document.querySelector(".close-button");

// Open the modal when the button is clicked
openModalButton.onclick = function () {
    modal.classList.remove("hidden");
}

// Close the modal when the close button is clicked
closeModalButton.onclick = function () {
    modal.classList.add("hidden");
}