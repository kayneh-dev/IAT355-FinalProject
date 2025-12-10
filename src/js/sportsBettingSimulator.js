/* BETTING SIMULATOR LOGIC */
    let balance = 1000.00;
    let initialBalance = 1000.00;
    let betCount = 0;
    let lossStreak = 0;
    let selectedMatchId = null;

    const matches = [
        { id: 1, sport: "NBA", teamA: "Lakers", teamB: "Warriors", oddsA: 1.90, oddsB: 1.90, chanceA: 0.50 },
        { id: 2, sport: "NFL", teamA: "Chiefs", teamB: "Raiders", oddsA: 1.30, oddsB: 3.40, chanceA: 0.75 },
        { id: 3, sport: "MLB", teamA: "Yankees", teamB: "Red Sox", oddsA: 1.75, oddsB: 2.10, chanceA: 0.55 },
        { id: 4, sport: "UFC", teamA: "McGregor", teamB: "Chandler", oddsA: 2.50, oddsB: 1.55, chanceA: 0.38 }
    ];

    const matchesContainer = document.getElementById('matches-grid-container');
    const balanceDisplay = document.getElementById('balance-display');
    const profitDisplay = document.getElementById('profit-display');
    const historyList = document.getElementById('history-list');
    const realityCheck = document.getElementById('reality-check');
    const wagerInput = document.getElementById('wager-amount');

    function init() { 
        renderMatches();
        updateUI(); // Makes the display to update immediately on load

        if(wagerInput) {
            wagerInput.addEventListener('input', updatePotentialEarnings);
        }
    }

    function renderMatches() {
        matchesContainer.innerHTML = '';

        matches.forEach(match => {
            const card = document.createElement('div');

            const isSelected = match.id === selectedMatchId ? 'selected' : '';

            card.className = `match-card ${isSelected}`;
            card.onclick = (e) => selectMatch(match.id, e);

            card.innerHTML = `
                <div class="match-info mb-3 mb-md-0">
                    <span class="sport-tag">${match.sport}</span>
                    <div class="teams">${match.teamA} vs ${match.teamB}</div>
                </div>

                <div class="bet-buttons">
                    <button class="bet-btn">
                        <span class="teams">${match.teamA}</span><br>
                        <span class="odds-val">${match.oddsA.toFixed(2)}</span>
                        <span class="potential-payout" id="payout-${match.id}-A">Payout: $0.00</span>
                    </button>
                    <button class="bet-btn">
                        <span class="teams">${match.teamB}</span><br>
                        <span class="odds-val">${match.oddsB.toFixed(2)}</span>
                        <span class="potential-payout" id="payout-${match.id}-B">Payout: $0.00</span>
                    </button>
                </div>
            `;
            const buttonA = card.querySelector(".bet-btn:nth-child(1)");
            const buttonB = card.querySelector(".bet-btn:nth-child(2)");

            buttonA.addEventListener("click", () => placeBet(match.id, "A"));
            buttonB.addEventListener("click", () => placeBet(match.id, "B"));
                matchesContainer.appendChild(card);
            });
        
        // Update earnings
        updatePotentialEarnings();
    }

    function selectMatch(id, event) {
        if (event.target.closest('button')) return;

        if (selectedMatchId === id) {
            selectedMatchId = null;
        } else {
            selectedMatchId = id;
        }
        renderMatches();
    }

    function updatePotentialEarnings() {
        const wager = parseFloat(wagerInput.value);
        const validWager = isNaN(wager) ? 0 : wager;

        matches.forEach(match => {
            //Calculate payout for Team A
            const payoutA = (validWager * match.oddsA).toFixed(2);
            const spanA = document.getElementById(`payout-${match.id}-A`);
            if (spanA) spanA.textContent = `Payout: $${payoutA}`;

            //Calculate payout for Team B
            const payoutB = (validWager * match.oddsB).toFixed(2);
            const spanB = document.getElementById(`payout-${match.id}-B`);
            
            if (spanB) spanB.textContent = `Payout: $${payoutB}`;
        })
    }

    function placeBet(matchId, pick) {
        const wagerInput = document.getElementById('wager-amount');
        const wager = parseFloat(wagerInput.value);

        if (isNaN(wager) || wager <= 0) {
            alert("Please enter a valid wager amount."); 
            return;
        }
        if (wager > balance) {
            alert("Insufficient funds!");
            return;
        }

        const match = matches.find(m => m.id === matchId);
        const isPickA = pick === 'A';
        const teamName = isPickA ? match.teamA : match.teamB;
        const odds = isPickA ? match.oddsA : match.oddsB;
        const winChance = match.chanceA; 

        // Simulate Sports Betting
        const randomOutcome = Math.random();
        let won = false;

        if (isPickA && randomOutcome < winChance) won = true;
        else if (!isPickA && randomOutcome >= winChance) won = true;

        balance -= wager;

        if (won) {
            const payout = wager * odds;
            balance += payout;
            lossStreak = 0;
            logResult(teamName, wager, payout - wager, true);
        } else {
            lossStreak++;
            logResult(teamName, wager, -wager, false);
        }
        betCount++;
        updateUI();

        renderMatches();

        if (betCount === 5 || lossStreak >= 3) realityCheck.style.display = "block";
    }

    function updateUI() {
        balanceDisplay.textContent = `$${balance.toFixed(2)}`;
        const profit = balance - initialBalance;
        profitDisplay.textContent = `${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`;
        
        // Dynamically set color based on profit
        profitDisplay.style.color = profit >= 0 ? '#10b981' : '#ef4444'; 
    }

    function logResult(team, wager, profit, won) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `
            <span>Bet on <strong>${team}</strong> ($${wager})</span>
            <span class="${won ? 'text-success' : 'text-danger'} fw-bold">
                ${won ? 'WIN' : 'LOSS'} (${profit >= 0 ? '+' : ''}${profit.toFixed(2)})
            </span>
        `;
        historyList.prepend(entry);
    }
    
    // Start the simulator
    init();