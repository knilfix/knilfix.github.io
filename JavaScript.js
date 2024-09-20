let trades = [];

document.getElementById('tradeForm').onsubmit = function (e) {
    e.preventDefault();
    const trade = {
        entryDate: document.getElementById('entryDate').value,
        exitDate: document.getElementById('exitDate').value,
        pair: document.getElementById('pair').value,
        tradeType: document.getElementById('tradeType').value,
        positionSize: parseFloat(document.getElementById('positionSize').value),
        entryPrice: parseFloat(document.getElementById('entryPrice').value),
        exitPrice: parseFloat(document.getElementById('exitPrice').value),
        stopLoss: parseFloat(document.getElementById('stopLoss').value),
        strategy: document.getElementById('strategy').value,
        profitLoss: parseFloat(document.getElementById('profitLoss').value),
        commission: parseFloat(document.getElementById('commission').value)
    };
    trades.push(trade);
    updateTable();
    this.reset();
};

function updateTable() {
    const table = document.getElementById('tradesTable');
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    trades.forEach(trade => {
        const row = table.insertRow();
        row.insertCell(0).textContent = new Date(trade.entryDate).toLocaleString();
        row.insertCell(1).textContent = new Date(trade.exitDate).toLocaleString();
        row.insertCell(2).textContent = trade.pair;
        row.insertCell(3).textContent = trade.tradeType;
        row.insertCell(4).textContent = trade.positionSize;
        row.insertCell(5).textContent = trade.entryPrice;
        row.insertCell(6).textContent = trade.exitPrice;
        row.insertCell(7).textContent = trade.stopLoss;
        row.insertCell(8).textContent = trade.strategy;
        row.insertCell(9).textContent = trade.profitLoss;
        row.insertCell(10).textContent = trade.commission;
    });
}

function saveTrades() {
    const dataStr = JSON.stringify(trades, null, 2); // Pretty print JSON
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "forex-trades.json";

    // Append to the body, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Clean up the URL object
    URL.revokeObjectURL(url);
}

function loadTrades() {
    const file = document.getElementById('loadFile').files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        trades = JSON.parse(e.target.result);
        updateTable();
    };

    reader.readAsText(file);
}