/* SPORTS BETTING SIMULATOR LOGIC */
let balance = 1000.00;
let initialBalance = 1000.00;
let betCount = 0;
let lossStreak = 0;
let selectedMatchId = null;

// Trackers for the "Economics" receipt
let totalWagered = 0;
let totalPayouts = 0;
let gameHistory = []; 

// Track which team was picked for each match
// Format: { 1: 'A', 2: 'B' } -> Key is match ID, Value is the side ('A' or 'B')
let matchPicks = {}; 

const matches = [
    { id: 1, sport: "NBA", teamA: "Lakers", teamB: "Warriors", oddsA: 1.90, oddsB: 1.90, chanceA: 0.50 },
    { id: 2, sport: "NFL", teamA: "Chiefs", teamB: "Raiders", oddsA: 1.30, oddsB: 3.80, chanceA: 0.75 },
    { id: 3, sport: "MLB", teamA: "Yankees", teamB: "Red Sox", oddsA: 1.75, oddsB: 2.10, chanceA: 0.55 },
    { id: 4, sport: "UFC", teamA: "McGregor", teamB: "Chandler", oddsA: 2.50, oddsB: 1.55, chanceA: 0.38 }
];

// DOM Elements
const matchesContainer = document.getElementById('matches-grid-container');
const balanceDisplay = document.getElementById('balance-display');
const profitDisplay = document.getElementById('profit-display');
const historyList = document.getElementById('history-list');
const realityCheck = document.getElementById('reality-check');
const wagerInput = document.getElementById('wager-amount');
const resetBtn = document.getElementById('reset-btn');

// Math Box Elements
const mathBox = document.getElementById('math-breakdown');
const mathStep1 = document.getElementById('math-step-1');
const mathTotalReturn = document.getElementById('math-total-return');
const selectedMatchLabel = document.getElementById('selected-match-label');

// Receipt Elements
const receiptBankroll = document.getElementById('receipt-bankroll');
const receiptGamesList = document.getElementById('receipt-games-list');
const receiptUserProfit = document.getElementById('receipt-user-profit');
const receiptAppRev = document.getElementById('receipt-app-rev');
const receiptGovTax = document.getElementById('receipt-gov-tax');

function init() { 
    renderMatches();
    updateUI(); 
    
    // Add Placeholder to Betting Log
    if(historyList) {
        historyList.innerHTML = '<div id="log-placeholder" class="text-center text-muted small">No bets placed yet.</div>';
    }

    if(wagerInput) {
        wagerInput.addEventListener('input', () => {
            renderMatches(); // Re-render to update card payouts
            updateMathBox(); // Update the top math box
        });
    }

    if(resetBtn) {
        resetBtn.addEventListener('click', resetSimulation);
    }
}

function renderMatches() {
    matchesContainer.innerHTML = '';
    
    matches.forEach(match => {
        const card = document.createElement('div');
        const isSelected = match.id === selectedMatchId ? 'selected' : '';
        card.className = `match-card ${isSelected}`;
        
        // Click to select/lock the math box
        card.onclick = (e) => selectMatch(match.id, e);

        const currentPick = matchPicks[match.id]; 
        const disabledStyle = "opacity: 0.5; cursor: not-allowed; border-color: #444;";

        card.innerHTML = `
            <div class="match-info mb-3 mb-md-0">
                <span class="sport-tag">${match.sport}</span>
                <div class="teams">${match.teamA} vs ${match.teamB}</div>
            </div>

            <div class="bet-buttons">
                <button class="bet-btn" 
                    onclick="placeBet(${match.id}, 'A')"
                    onmouseenter="hoverBet(${match.id}, 'A')" 
                    onmouseleave="leaveBet()"
                    ${currentPick === 'B' ? 'disabled' : ''}
                    style="${currentPick === 'B' ? disabledStyle : ''}"
                >
                    <span class="teams">${match.teamA}</span><br>
                    <span class="odds-val">${match.oddsA.toFixed(2)}</span>
                </button>

                <button class="bet-btn" 
                    onclick="placeBet(${match.id}, 'B')"
                    onmouseenter="hoverBet(${match.id}, 'B')" 
                    onmouseleave="leaveBet()"
                    ${currentPick === 'A' ? 'disabled' : ''}
                    style="${currentPick === 'A' ? disabledStyle : ''}"
                >
                    <span class="teams">${match.teamB}</span><br>
                    <span class="odds-val">${match.oddsB.toFixed(2)}</span>
                </button>
            </div>
        `;
        matchesContainer.appendChild(card);
    });
}

// 1. HOVER PICKS: show specific odds
function hoverBet(matchId, pick) {
    if(mathBox) mathBox.classList.remove('hidden'); // Show odd calculation box
    updateMathBox(matchId, pick); // Update values
}

// 2. HOVER LEAVE: Revert to default state
function leaveBet() {
    if (selectedMatchId) {
        // If a match is clicked, go back to showing THAT match
        updateMathBox(selectedMatchId);
    } else {
        // If nothing is clicked, hide the box again
        if(mathBox) mathBox.classList.add('hidden');
        if(selectedMatchLabel) selectedMatchLabel.textContent = "*Select a match to see calculation";
    }
}

function selectMatch(id, event) {
    if (event.target.closest('button')) return; // Don't select if clicking bet button

    if (selectedMatchId === id) {
        selectedMatchId = null;
        if(mathBox) mathBox.classList.add('hidden');
        if(selectedMatchLabel) selectedMatchLabel.textContent = "*Select a match to see calculation";
    } else {
        selectedMatchId = id;
        if(mathBox) mathBox.classList.remove('hidden');
    }
    renderMatches();
    updateMathBox();
}

function updateMathBox(matchId = null, pick = null) {
    const targetId = matchId || selectedMatchId;
    if(!targetId) return; 

    const match = matches.find(m => m.id === targetId);
    const wager = parseFloat(wagerInput.value) || 0;
    
    // Hover Pick -> Locked Pick -> Default 'A'
    const targetPick = pick || matchPicks[targetId] || 'A';
    
    const isPickA = targetPick === 'A';
    const teamName = isPickA ? match.teamA : match.teamB;
    const odds = isPickA ? match.oddsA : match.oddsB;
    const potentialReturn = (wager * odds).toFixed(2);

    // Update Label
    if(selectedMatchLabel) {
        selectedMatchLabel.textContent = `Viewing calculation for ${teamName}`;
    }
    
    // Update the Formula Numbers
    if(mathStep1) {
        mathStep1.innerHTML = `
            $${wager} (Wager) &times; <span style="color:var(--accent);">${odds.toFixed(2)}</span> (Odds) 
            = <strong>$${potentialReturn}</strong>
        `;
    }
    
    if(mathTotalReturn) {
        mathTotalReturn.textContent = `$${potentialReturn}`;
    }
}

function placeBet(matchId, pick) {
    // LOGIC CHECK: Prevent hedging (betting on both sides)
    // If user picked 'A' before, I can bet 'A' again. But I cannot bet 'B'.
    if (matchPicks[matchId] && matchPicks[matchId] !== pick) {
        alert("You cannot bet on the opponent! You must stick to your side.");
        return;
    }

    const wager = parseFloat(wagerInput.value);

    if (isNaN(wager) || wager <= 0) {
        alert("Please enter a valid wager amount."); 
        return;
    }
    if (wager > balance) {
        alert("Insufficient funds!");
        return;
    }

    // LOCKING THE PICK: Save which side they chose
    matchPicks[matchId] = pick;

    const match = matches.find(m => m.id === matchId);
    const isPickA = pick === 'A';
    const teamName = isPickA ? match.teamA : match.teamB;
    const odds = isPickA ? match.oddsA : match.oddsB;
    const winChance = match.chanceA; 

    // Simulate Result
    const randomOutcome = Math.random();
    let won = false;
    if (isPickA && randomOutcome < winChance) won = true;
    else if (!isPickA && randomOutcome >= winChance) won = true;

    // Financial Updates
    balance -= wager;
    totalWagered += wager; 

    let profitAmt = -wager; 

    if (won) {
        const payout = wager * odds;
        balance += payout;
        totalPayouts += payout;
        profitAmt = payout - wager;
        lossStreak = 0;
        logResult(teamName, wager, profitAmt, true);
        gameHistory.push({ name: `Game ${betCount + 1}`, result: 'Win', val: profitAmt });
    } else {
        lossStreak++;
        logResult(teamName, wager, -wager, false);
        gameHistory.push({ name: `Game ${betCount + 1}`, result: 'Loss', val: -wager });
    }
    
    betCount++;
    updateUI();
    updateReceipt();
    renderMatches(); // Re-render to update button states (disable opponents)
    
    if (betCount === 5 || lossStreak >= 3) {
        if(realityCheck) realityCheck.style.display = "block";
    }
}

function updateUI() {
    balanceDisplay.textContent = `$${balance.toFixed(2)}`;
    const profit = balance - initialBalance;
    profitDisplay.textContent = `${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`;
    profitDisplay.style.color = profit >= 0 ? '#10b981' : '#ef4444'; 
}

function updateReceipt() {
    receiptBankroll.textContent = `$${balance.toFixed(2)}`;

    receiptGamesList.innerHTML = '';
    gameHistory.forEach(game => {
        const row = document.createElement('div');
        row.className = "d-flex justify-content-between mb-1";
        const resultClass = game.result === 'Win' ? 'text-win' : 'text-loss';
        
        row.innerHTML = `
            <span>${game.name} (${game.result})</span>
            <span class="${resultClass}">${game.val >= 0 ? '+' : ''}$${game.val.toFixed(0)}</span>
        `;
        receiptGamesList.appendChild(row);
    });

    const userProfit = balance - initialBalance;
    receiptUserProfit.textContent = `${userProfit >= 0 ? '+' : ''}$${userProfit.toFixed(2)}`;
    receiptUserProfit.style.color = userProfit >= 0 ? '#10b981' : '#ef4444';

    const appRevenue = totalWagered - totalPayouts;
    receiptAppRev.textContent = `${appRevenue >= 0 ? '+' : ''}$${appRevenue.toFixed(2)}`;
    
    const tax = totalWagered * 0.0025; 
    receiptGovTax.textContent = `+$${tax.toFixed(2)}`;
}

function logResult(team, wager, profit, won) {
    const list = document.getElementById('history-list');
    const placeholder = document.getElementById('log-placeholder');

    if (placeholder) {
        placeholder.remove();
    }

    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <span>Bet on <strong>${team}</strong> ($${wager})</span>
        <span class="${won ? 'text-success' : 'text-danger'} fw-bold">
            ${won ? 'WIN' : 'LOSS'} (${profit >= 0 ? '+' : ''}${profit.toFixed(2)})
        </span>
    `;
    list.prepend(entry);
}

function resetSimulation() {
    balance = initialBalance;
    betCount = 0;
    lossStreak = 0;
    totalWagered = 0;
    totalPayouts = 0;
    gameHistory = [];
    matchPicks = {}; // Clear the picks limitation

    updateUI();

    document.getElementById('receipt-bankroll').textContent = `$${balance.toFixed(2)}`;
    document.getElementById('receipt-user-profit').textContent = "$0.00";
    document.getElementById('receipt-app-rev').textContent = "$0.00";
    document.getElementById('receipt-gov-tax').textContent = "$0.00";
    
    const list = document.getElementById('history-list');
    list.innerHTML = '<div id="log-placeholder" class="text-center text-muted small">No bets placed yet.</div>';
    
    const receiptList = document.getElementById('receipt-games-list');
    receiptList.innerHTML = '<div class="text-center text-muted small">No bets placed yet.</div>';

    if(realityCheck) realityCheck.style.display = "none";
    
    if(mathBox) mathBox.classList.add('hidden');
    selectedMatchId = null;
    
    renderMatches();
}

// Start the simulator
init();