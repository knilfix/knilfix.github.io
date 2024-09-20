
//location of other files
const indexhtml = '../index.html';

document.getElementById("accountSetupForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const startingBalance = parseFloat(document.getElementById("startingBalance").value);
    const tradingPair = document.getElementById("tradingPair").value;
    const account = { startingBalance, currentBalance: startingBalance, tradingPair };

    // Save account data to localStorage
    localStorage.setItem('tradingAccount', JSON.stringify(account));

    console.log("Starting balance:", startingBalance);
    console.log("Trading pair:", tradingPair);


    // Redirect to main trading journal page
    window.location.href = indexhtml;;
});