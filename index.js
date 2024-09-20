let account = null;
let trades = [];

document.getElementById("newAccountBtn").addEventListener("click", function () {
    window.location.href = 'account_setup.html';
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
        updateAccountDisplay();
        updateTradeTable();
        showMainContent();
    }
});

// Update account display
function updateAccountDisplay() {
    document.getElementById("displayStartingBalance").textContent = account.startingBalance.toFixed(2);
    document.getElementById("displayCurrentBalance").textContent = account.currentBalance.toFixed(2);
    document.getElementById("displayTradingPair").textContent = account.tradingPair;
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
    this.reset();
});

// Update account balance
function updateAccountDisplay() {
    if (account) {
        document.getElementById("displayStartingBalance").textContent = account.startingBalance.toFixed(2);
        document.getElementById("displayCurrentBalance").textContent = account.currentBalance.toFixed(2);
        document.getElementById("displayTradingPair").textContent = account.tradingPair;
    } else {
        // If account is null, reset displayed values
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
            updateAccountDisplay();
            updateTradeTable();
            // Update localStorage
            localStorage.setItem('tradingAccount', JSON.stringify(account));
            localStorage.setItem('tradingTrades', JSON.stringify(trades));
            showMainContent();
        };
        reader.readAsText(file);
    }
});

document.getElementById("clearDataBtn").addEventListener("click", function () {
    const confirmClear = confirm("Are you sure you want to clear all data?");
    if (confirmClear) {
        localStorage.clear(); // Clear local storage
        account = null; // Reset account variable
        trades = []; // Reset trades array

        // Update display and table
        updateAccountDisplay(); // Update display to reflect cleared data
        updateTradeTable(); // Clear trade table

        // Alert and refresh
        alert("All data has been cleared.");
        location.reload(); // Refresh the page
    }
});