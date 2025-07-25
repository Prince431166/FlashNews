document.addEventListener('DOMContentLoaded', () => {
    // User balance
    let balance = localStorage.getItem('casinoBalance');
    if (balance === null) {
        balance = 1000;
        localStorage.setItem('casinoBalance', balance);
    }
    document.getElementById('balance').textContent = balance;

    // Deposit and Withdrawal buttons
    document.getElementById('deposit-btn').addEventListener('click', () => {
        const amount = prompt('Enter deposit amount:');
        if (amount && !isNaN(amount) {
            balance = parseFloat(balance) + parseFloat(amount);
            updateBalance();
        } else {
            alert('Invalid amount!');
        }
    });

    document.getElementById('withdraw-btn').addEventListener('click', () => {
        const amount = prompt('Enter withdrawal amount:');
        if (amount && !isNaN(amount)) {
            if (parseFloat(amount) > parseFloat(balance)) {
                alert('Insufficient balance!');
            } else {
                balance = parseFloat(balance) - parseFloat(amount);
                updateBalance();
            }
        } else {
            alert('Invalid amount!');
        }
    });

    function updateBalance() {
        document.getElementById('balance').textContent = balance;
        localStorage.setItem('casinoBalance', balance);
    }

    // Game cards event listeners
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => {
            const game = card.getAttribute('data-game');
            document.getElementById(`${game}-modal`).style.display = 'flex';
        });
    });

    // Close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').style.display = 'none';
        });
    });

    // Slot Machine Logic
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');
    const spinBtn = document.getElementById('spin-btn');
    const resultDiv = document.getElementById('result');

    const symbols = ['🍒', '🍋', '🍇', '🍊', '🔔', '⭐', '7️⃣'];

    spinBtn.addEventListener('click', () => {
        // Deduct bet (for example $10 per spin)
        if (balance < 10) {
            alert('Insufficient balance!');
            return;
        }
        balance -= 10;
        updateBalance();

        // Clear previous result
        resultDiv.textContent = '';

        // Spinning animation
        let spins = 0;
        const spinInterval = setInterval(() => {
            reel1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            reel2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            reel3.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            spins++;
            if (spins > 10) {
                clearInterval(spinInterval);
                checkWin();
            }
        }, 100);
    });

    function checkWin() {
        const s1 = reel1.textContent;
        const s2 = reel2.textContent;
        const s3 = reel3.textContent;

        if (s1 === s2 && s2 === s3) {
            // Win jackpot
            const winAmount = 100;
            balance += winAmount;
            updateBalance();
            resultDiv.textContent = `JACKPOT! You won $${winAmount}`;
            resultDiv.style.color = 'green';
        } else if (s1 === s2 || s2 === s3 || s1 === s3) {
            // Small win
            const winAmount = 20;
            balance += winAmount;
            updateBalance();
            resultDiv.textContent = `You won $${winAmount}`;
            resultDiv.style.color = 'green';
        } else {
            resultDiv.textContent = 'Try again!';
            resultDiv.style.color = 'red';
        }
    }

    // Roulette Logic (simplified)
    // This is a very basic representation
    const betButtons = document.querySelectorAll('.bet-btn');
    const rouletteResult = document.getElementById('roulette-result');

    betButtons.forEach(button => {
        button.addEventListener('click', () => {
            const bet = button.getAttribute('data-bet');
            if (balance < 10) {
                alert('Insufficient balance!');
                return;
            }
            balance -= 10;
            updateBalance();

            // Simulate spin
            const winningNumber = Math.floor(Math.random() * 37); // 0 to 36
            const isRed = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(winningNumber);
            const isBlack = !isRed && winningNumber !== 0;

            // Determine win
            let win = false;
            if (bet === 'red' && isRed) win = true;
            if (bet === 'black' && isBlack) win = true;
            if (bet === '0' && winningNumber === 0) win = true;

            // Display result
            let color = isRed ? 'red' : (winningNumber === 0 ? 'green' : 'black');
            rouletteResult.innerHTML = `Winning number: <span style="color:${color}">${winningNumber}</span>`;
            
            if (win) {
                const winAmount = bet === '0' ? 350 : 20; // 35:1 for 0, 1:1 for others
                balance += winAmount;
                updateBalance();
                rouletteResult.innerHTML += `<br>You won $${winAmount}!`;
                rouletteResult.style.color = 'green';
            } else {
                rouletteResult.innerHTML += '<br>Try again!';
                rouletteResult.style.color = 'red';
            }
        });
    });
});
