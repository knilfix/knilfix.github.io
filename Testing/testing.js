// Sample trades data
const trades = [
    { entryDate: "2024-01-01", profitLoss: 100 },
    { entryDate: "2024-01-02", profitLoss: -50 },
    { entryDate: "2024-01-03", profitLoss: 200 },
    { entryDate: "2024-01-04", profitLoss: -30 },
    { entryDate: "2024-01-05", profitLoss: 150 },
];

// Starting balance
const initialBalance = 1000;

// Array to hold cumulative balances
const balances = [initialBalance];

// Calculate cumulative balances
trades.forEach(trade => {
    const newBalance = balances[balances.length - 1] + trade.profitLoss;
    balances.push(newBalance);
});

// Prepare data for console output
const xAxis = trades.map((_, index) => index + 1); // X-axis labels (trade index)

// Output the results to the console
console.log("Trade Index (X-axis):", xAxis);
console.log("Cumulative Balances (Y-axis):", balances);

// Display current balance in the HTML
document.getElementById('displayCurrentBalance').textContent = balances[balances.length - 1];

const ctx = document.getElementById('balanceChart').getContext('2d');
const balanceChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: xAxis, // Trade indices
        datasets: [{
            label: 'Cumulative Balance',
            data: balances, // Cumulative balances
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

