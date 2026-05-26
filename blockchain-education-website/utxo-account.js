/* ==========================================================================
   BLOCKCHAIN & WEB3 EDUCATIONAL HUB - LEDGERS & LOGS (utxo-account.js)
   Controls: UTXO visualizer, Account Transfer state, Stablecoins & ERC-20 Decoder.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initUtxoModel();
    initAccountModel();
    initStablecoinMintDecoder();
});

/* ==========================================================================
   UTXO Model Visualizer & Drawing Canvas
   ========================================================================== */
function initUtxoModel() {
    const coinContainer = document.getElementById("utxo-coin-container");
    const sendAmtInput = document.getElementById("utxo-send-amount");
    const sumInputsEl = document.getElementById("utxo-sum-inputs");
    const sumSendEl = document.getElementById("utxo-sum-send");
    const sumChangeEl = document.getElementById("utxo-sum-change");
    const execBtn = document.getElementById("btn-trigger-utxo-tx");
    const canvas = document.getElementById("utxo-diagram-canvas");

    if (!coinContainer || !canvas) return;

    const ctx = canvas.getContext("2d");

    let utxoPool = [
        { id: 1, txid: "a1a8c3...", amount: 0.5, selected: false },
        { id: 2, txid: "4facfe...", amount: 1.8, selected: false },
        { id: 3, txid: "00f2fe...", amount: 2.5, selected: false },
        { id: 4, txid: "b92b27...", amount: 1.2, selected: false },
    ];

    // Resize canvas
    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight || 280;
    }
    resizeCanvas();
    window.addEventListener("resize", () => {
        resizeCanvas();
        drawUtxoFlow();
    });

    // Render coins in wallet pool
    function renderUtxoPool() {
        coinContainer.innerHTML = "";
        utxoPool.forEach(coin => {
            const card = document.createElement("div");
            card.className = `utxo-coin-card ${coin.selected ? "selected" : ""}`;
            card.innerHTML = `
                <div class="coin-amt">${coin.amount} BTC</div>
                <div class="coin-txid">txid:${coin.txid}</div>
            `;
            card.addEventListener("click", () => {
                coin.selected = !coin.selected;
                calculateUtxoState();
                renderUtxoPool();
            });
            coinContainer.appendChild(card);
        });
    }
    renderUtxoPool();

    function calculateUtxoState() {
        const sumInputs = utxoPool.filter(c => c.selected).reduce((acc, c) => acc + c.amount, 0);
        const sendAmount = parseFloat(sendAmtInput.value) || 0;

        sumInputsEl.textContent = `${sumInputs.toFixed(2)} BTC`;
        sumSendEl.textContent = `${sendAmount.toFixed(2)} BTC`;
        
        let change = sumInputs - sendAmount;
        if (change < 0) {
            sumChangeEl.textContent = "0.0 BTC (Shortage!)";
            sumChangeEl.style.color = "var(--neon-red)";
            execBtn.disabled = true;
        } else {
            sumChangeEl.textContent = `${change.toFixed(2)} BTC`;
            sumChangeEl.style.color = "";
            execBtn.disabled = sumInputs === 0;
        }

        drawUtxoFlow(sumInputs, sendAmount, Math.max(0, change));
    }

    sendAmtInput.addEventListener("input", calculateUtxoState);

    // Draw the UTXO transaction flow diagram
    function drawUtxoFlow(sumInputs = 0, sendAmount = 0, change = 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const w = canvas.width;
        const h = canvas.height;
        const midY = h / 2;

        // Draw Transaction Node Box (Center)
        ctx.fillStyle = "rgba(168, 85, 247, 0.15)";
        ctx.strokeStyle = "var(--neon-purple)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(w / 2 - 50, midY - 30, 100, 60, 8);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("TRANSACTION", w / 2, midY - 5);
        ctx.fillStyle = "#64748b";
        ctx.font = "9px monospace";
        ctx.fillText("tx_hash:92ac...", w / 2, midY + 15);

        // Draw Inputs boxes on left
        const selectedCoins = utxoPool.filter(c => c.selected);
        if (selectedCoins.length > 0) {
            const startY = midY - ((selectedCoins.length - 1) * 35) / 2;
            selectedCoins.forEach((c, idx) => {
                const boxX = 20;
                const boxY = startY + idx * 35 - 12;
                
                ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
                ctx.strokeStyle = "rgba(251, 191, 36, 0.5)";
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.roundRect(boxX, boxY, 90, 24, 4);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "var(--neon-gold)";
                ctx.font = "bold 9px monospace";
                ctx.textAlign = "left";
                ctx.fillText(`Input:${c.amount} BTC`, boxX + 6, boxY + 15);

                // Connector line to Center Transaction Box
                ctx.strokeStyle = "rgba(251, 191, 36, 0.35)";
                ctx.beginPath();
                ctx.moveTo(boxX + 90, boxY + 12);
                ctx.lineTo(w / 2 - 50, midY);
                ctx.stroke();
            });
        } else {
            ctx.fillStyle = "#64748b";
            ctx.font = "italic 11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("[Select Inputs Left]", 70, midY);
        }

        // Draw Outputs boxes on right (Bob + Change)
        if (sumInputs > 0) {
            // Bob's Output (Top Right)
            const bobY = midY - 45;
            ctx.fillStyle = "rgba(0, 242, 254, 0.05)";
            ctx.strokeStyle = "var(--neon-cyan)";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.roundRect(w - 120, bobY, 100, 30, 4);
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 9px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("Bob's Output (To)", w - 114, bobY + 13);
            ctx.fillStyle = "var(--neon-cyan)";
            ctx.font = "bold 9px monospace";
            ctx.fillText(`${sendAmount.toFixed(2)} BTC`, w - 114, bobY + 24);

            // Change Output (Bottom Right)
            const changeY = midY + 15;
            ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
            ctx.strokeStyle = change > 0 ? "rgba(251, 191, 36, 0.5)" : "rgba(255,255,255,0.1)";
            ctx.beginPath();
            ctx.roundRect(w - 120, changeY, 100, 30, 4);
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 9px sans-serif";
            ctx.fillText("Your Change (To)", w - 114, changeY + 13);
            ctx.fillStyle = change > 0 ? "var(--neon-gold)" : "#64748b";
            ctx.font = "bold 9px monospace";
            ctx.fillText(`${change.toFixed(2)} BTC`, w - 114, changeY + 24);

            // Connector lines from Transaction center to Outputs
            ctx.strokeStyle = "rgba(168, 85, 247, 0.35)";
            ctx.beginPath();
            ctx.moveTo(w / 2 + 50, midY);
            ctx.lineTo(w - 120, bobY + 15);
            ctx.moveTo(w / 2 + 50, midY);
            ctx.lineTo(w - 120, changeY + 15);
            ctx.stroke();
        }
    }
    drawUtxoFlow();

    // Trigger UTXO execution
    execBtn.addEventListener("click", () => {
        const sumInputs = utxoPool.filter(c => c.selected).reduce((acc, c) => acc + c.amount, 0);
        const sendAmount = parseFloat(sendAmtInput.value) || 0;
        const change = sumInputs - sendAmount;

        alert(`UTXO Transaction successful!\n\nLocked inputs: ${sumInputs.toFixed(2)} BTC\nSent to Bob: ${sendAmount.toFixed(2)} BTC\nReturned change output: ${change.toFixed(2)} BTC`);
        
        // Reset pool: remove spent inputs, insert change UTXO back into the list
        utxoPool = utxoPool.filter(c => !c.selected);
        if (change > 0) {
            utxoPool.push({
                id: Date.now(),
                txid: "utxo_change...",
                amount: parseFloat(change.toFixed(2)),
                selected: false
            });
        }
        
        // Regenerate pool
        renderUtxoPool();
        calculateUtxoState();
    });
}

/* ==========================================================================
   Account-Based Model & EVM Transfer state machine
   ========================================================================== */
function initAccountModel() {
    const listContainer = document.getElementById("eth-accounts-list");
    const sendValEl = document.getElementById("eth-send-value");
    const triggerBtn = document.getElementById("btn-trigger-account-tx");
    const consoleLogs = document.getElementById("eth-event-logs-console");

    if (!listContainer || !consoleLogs) return;

    let accounts = [
        { addr: "0x4facfe1d09e3bc8917d84a71b2f0a1c3df4032a9", name: "Alice (EOA)", balance: 10.50, selected: true },
        { addr: "0x3c3c3d0b21a8c3d3f90ab94c718a2c3df40f1a92", name: "Bob (EOA)", balance: 4.20, selected: false },
        { addr: "0x8c8c8cb6b6c62c2b29a2bc2245b0a1c3df4f1a92", name: "SimpleWallet (Contract)", balance: 100.00, selected: false }
    ];

    function renderAccounts() {
        listContainer.innerHTML = "";
        accounts.forEach(acc => {
            const card = document.createElement("div");
            card.className = `eth-account-card ${acc.selected ? "selected" : ""}`;
            card.innerHTML = `
                <div class="account-meta">
                    <span class="account-type-tag">${acc.name}</span>
                    <span class="account-addr-hex">${acc.addr.substring(0, 10)}...${acc.addr.substring(34)}</span>
                </div>
                <div class="account-balance-large">${acc.balance.toFixed(2)} ETH</div>
            `;
            
            // Only allow selecting EOAs (Alice or Bob)
            if (acc.name.includes("EOA")) {
                card.style.cursor = "pointer";
                card.addEventListener("click", () => {
                    accounts.forEach(a => a.selected = false);
                    acc.selected = true;
                    renderAccounts();
                });
            }
            listContainer.appendChild(card);
        });
    }
    renderAccounts();

    triggerBtn.addEventListener("click", () => {
        const selectedEoa = accounts.find(a => a.selected);
        const contractAcc = accounts.find(a => a.name.includes("Contract"));
        const val = parseFloat(sendValEl.value) || 0;

        if (!selectedEoa) {
            alert("Please select an EOA wallet account first!");
            return;
        }

        if (selectedEoa.balance < val) {
            alert(`Insufficient balance! Alice only has ${selectedEoa.balance} ETH.`);
            return;
        }

        // Deduct and add
        selectedEoa.balance -= val;
        contractAcc.balance += val;
        renderAccounts();

        // Print interactive EVM logs
        const block = Math.floor(Math.random() * 200000) + 17000000;
        const txHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
        
        const logItem = document.createElement("div");
        logItem.className = "explorer-log-item";
        logItem.innerHTML = `
            <div class="log-tx-header">
                <span>TX COMPLETED</span>
                <span class="ticker-green">Block #${block}</span>
            </div>
            <div class="log-tx-body">
                <span><strong>Hash:</strong> ${txHash.substring(0, 32)}...</span>
                <span><strong>From:</strong> ${selectedEoa.addr}</span>
                <span><strong>To:</strong> ${contractAcc.addr}</span>
                <span><strong>Value:</strong> ${val.toFixed(2)} ETH</span>
                <span><strong>Gas Used:</strong> 21,340 Gwei</span>
                <span class="log-event-badge">Log Event: Deposit(sender: ${selectedEoa.addr.substring(0, 8)}.., value: ${val.toFixed(2)} ETH)</span>
            </div>
        `;

        // Insert at top of console log box
        consoleLogs.insertBefore(logItem, consoleLogs.firstChild);
    });
}

/* ==========================================================================
   Stablecoins Minter & Hexadecimal Event Decoder
   ========================================================================== */
function initStablecoinMintDecoder() {
    const mintRange = document.getElementById("stable-mint-range");
    const mintDisplay = document.getElementById("mint-amt-display");
    const collateralVal = document.getElementById("stable-collateral-val");
    const supplyVal = document.getElementById("stable-minted-val");
    
    const btnMint = document.getElementById("btn-stable-mint");
    const btnBurn = document.getElementById("btn-stable-burn");
    
    const btnDecode = document.getElementById("btn-decode-log");
    const decodedBox = document.getElementById("decoded-log-output");

    if (!mintRange || !decodedBox) return;

    let collateral = 150.00;
    let mintedSupply = 100.00;

    // Collateral mint slider calculator
    mintRange.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        mintDisplay.textContent = `${val.toFixed(2)} DSC`;
    });

    btnMint.addEventListener("click", () => {
        const targetMint = parseFloat(mintRange.value);
        
        // Mints stablecoins. E.g. requires over-collateralization of 150%
        const neededCollateral = targetMint * 1.50;
        collateral += neededCollateral;
        mintedSupply += targetMint;
        
        collateralVal.textContent = `$${collateral.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        supplyVal.textContent = `${mintedSupply.toLocaleString(undefined, {minimumFractionDigits: 2})} DSC`;
        
        alert(`Successfully locked $${neededCollateral.toFixed(2)} fiat collateral to mint ${targetMint.toFixed(2)} DSC stablecoins!`);
    });

    btnBurn.addEventListener("click", () => {
        const targetBurn = parseFloat(mintRange.value);
        if (mintedSupply - targetBurn < 10) {
            alert("Stablecoin supply must remain above a base registry of 10 DSC.");
            return;
        }

        const retrievedCollateral = targetBurn * 1.50;
        collateral -= retrievedCollateral;
        mintedSupply -= targetBurn;
        
        collateralVal.textContent = `$${collateral.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        supplyVal.textContent = `${mintedSupply.toLocaleString(undefined, {minimumFractionDigits: 2})} DSC`;
        
        alert(`Successfully burned ${targetBurn.toFixed(2)} DSC to unlock $${retrievedCollateral.toFixed(2)} fiat collateral back to your wallet.`);
    });

    // Event Log hex decoder
    btnDecode.addEventListener("click", () => {
        decodedBox.style.display = "block";
        decodedBox.innerHTML = `
            <div style="font-weight: 700; border-bottom: 1px solid rgba(16, 185, 129, 0.15); padding-bottom: 0.35rem; margin-bottom: 0.5rem;">
                DECODED TRANSFER EVENT LOG
            </div>
            <div><strong>Event Name:</strong> Transfer(address from, address to, uint256 value)</div>
            <div><strong>Sender Address (From):</strong> 0x4facfe1d09e3bc8917d84a71b2f0a1c3df4032a9</div>
            <div><strong>Recipient Address (To):</strong> 0x3c3c3d0b21a8c3d3f90ab94c718a2c3df40f1a92</div>
            <div><strong>Amount Transferred:</strong> 1,000.00 USDC ($1,000.00)</div>
            <div><strong>Token Contract:</strong> 0xa2775ca0a1c3df40f1a92b21a8c3d3f90ab94c71 (USDC ERC-20)</div>
            <div style="margin-top: 0.5rem; font-size: 0.72rem; color: #64748b;">
                *Decoded signature matched topic signature hash (Topic 0). Hex addresses and values converted from 32-byte memory bytes.
            </div>
        `;
    });
}
