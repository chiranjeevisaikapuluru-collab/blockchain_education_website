/* ==========================================================================
   BLOCKCHAIN & WEB3 EDUCATIONAL HUB - SIMULATORS (simulator.js)
   Controls: Centralized vs Decentralized Canvas, Mempool queues, SHA-256, PoW Miner.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initNetworkSimulators();
    initMempoolAndMiner();
});

/* ==========================================================================
   SHA-256 Pure JavaScript Hashing Implementation
   ========================================================================== */
function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }
    
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length';
    var i, j; // Used as a dummy index in loops

    var result = '';
    var words = [];
    var asciiLength = ascii[lengthProperty];
    var hash = sha256.h = sha256.h || [];
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }

    ascii += '\x80'; // Append '1' bit and seven '0' bits
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00'; // Key padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return; // ASCII check
        words[i >> 2] |= j << ((3 - i % 4) * 8);
    }
    words[words[lengthProperty]] = ((asciiLength * 8) / maxWord) | 0;
    words[words[lengthProperty]] = (asciiLength * 8) | 0;

    // Process each chunk
    for (j = 0; j < words[lengthProperty]; ) {
        var w = words.slice(j, j += 16);
        var oldHash = hash.slice(0);

        hash = hash.slice(0, 8);

        for (i = 0; i < 64; i++) {
            var w16 = w[i - 16], w15 = w[i - 15], w7 = w[i - 7], w2 = w[i - 2];
            var s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
            var s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
            var ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
            var maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
            
            var temp1 = hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + (w[i] = (i < 16) ? w[i] : (w16 + s0 + w7 + s1) | 0);
            var temp2 = (rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj;

            hash = [(temp1 + temp2) | 0].concat(hash);
            hash[4] = (hash[4] + temp1) | 0;
        }

        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i]) | 0;
        }
    }

    for (i = 0; i < 8; i++) {
        var word = hash[i];
        // Correct negative numbers to hex
        var hex = (word < 0 ? maxWord + word : word).toString(16);
        result += (hex[lengthProperty] < 8 ? '0' + hex : hex);
    }
    return result;
}

/* ==========================================================================
   Centralized vs Decentralized Canvas Simulators
   ========================================================================== */
function initNetworkSimulators() {
    // 1. Centralized Canvas
    const centCanvas = document.getElementById("centralized-canvas");
    const centBtn = document.getElementById("btn-toggle-central");
    
    if (centCanvas && centBtn) {
        const ctx = centCanvas.getContext("2d");
        let serverOnline = true;
        
        centBtn.addEventListener("click", () => {
            serverOnline = !serverOnline;
            centBtn.querySelector("span").textContent = serverOnline ? "Simulate Server Collapse" : "Restore Server Node";
            centBtn.className = serverOnline ? "btn btn-secondary" : "btn btn-primary";
        });
        
        function drawCentralized() {
            ctx.clearRect(0, 0, centCanvas.width, centCanvas.height);
            const cx = centCanvas.width / 2;
            const cy = centCanvas.height / 2;
            const clients = 6;
            const radius = 80;
            
            // Draw client connections
            if (serverOnline) {
                ctx.strokeStyle = "rgba(0, 242, 254, 0.4)";
                ctx.lineWidth = 2;
                for (let i = 0; i < clients; i++) {
                    const angle = (i * 2 * Math.PI) / clients;
                    const x = cx + radius * Math.cos(angle);
                    const y = cy + radius * Math.sin(angle);
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            }
            
            // Draw Client Nodes
            for (let i = 0; i < clients; i++) {
                const angle = (i * 2 * Math.PI) / clients;
                const x = cx + radius * Math.cos(angle);
                const y = cy + radius * Math.sin(angle);
                
                ctx.beginPath();
                ctx.arc(x, y, 10, 0, Math.PI * 2);
                ctx.fillStyle = "#94a3b8";
                ctx.fill();
            }
            
            // Draw Central Server Node
            ctx.beginPath();
            ctx.arc(cx, cy, 18, 0, Math.PI * 2);
            ctx.fillStyle = serverOnline ? "var(--neon-cyan)" : "var(--neon-red)";
            ctx.shadowBlur = serverOnline ? 12 : 0;
            ctx.shadowColor = serverOnline ? "var(--neon-cyan)" : "transparent";
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Text labels
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 9px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(serverOnline ? "SERVER" : "OFFLINE", cx, cy - 24);
            
            requestAnimationFrame(drawCentralized);
        }
        drawCentralized();
    }
    
    // 2. Decentralized Canvas
    const decCanvas = document.getElementById("decentralized-canvas");
    const decBtn = document.getElementById("btn-reset-decentral");
    
    if (decCanvas && decBtn) {
        const ctx = decCanvas.getContext("2d");
        const nodeCount = 6;
        let nodes = [];
        
        function setupNodes() {
            nodes = [];
            const cx = decCanvas.width / 2;
            const cy = decCanvas.height / 2;
            const radius = 80;
            for (let i = 0; i < nodeCount; i++) {
                const angle = (i * 2 * Math.PI) / nodeCount;
                nodes.push({
                    id: i,
                    x: cx + radius * Math.cos(angle),
                    y: cy + radius * Math.sin(angle),
                    online: true
                });
            }
        }
        setupNodes();
        
        decBtn.addEventListener("click", () => {
            nodes.forEach(n => n.online = true);
        });
        
        // Disable node on click
        decCanvas.addEventListener("click", (e) => {
            const rect = decCanvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            nodes.forEach(n => {
                const dx = n.x - clickX;
                const dy = n.y - clickY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 15) {
                    n.online = !n.online;
                }
            });
        });
        
        function drawDecentralized() {
            ctx.clearRect(0, 0, decCanvas.width, decCanvas.height);
            
            // Draw mesh peer connection lines
            ctx.lineWidth = 1.5;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    if (nodes[i].online && nodes[j].online) {
                        ctx.strokeStyle = "rgba(168, 85, 247, 0.45)";
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            // Draw Peer nodes
            nodes.forEach(n => {
                ctx.beginPath();
                ctx.arc(n.x, n.y, 11, 0, Math.PI * 2);
                ctx.fillStyle = n.online ? "var(--neon-purple)" : "var(--neon-red)";
                ctx.shadowBlur = n.online ? 8 : 0;
                ctx.shadowColor = "var(--neon-purple)";
                ctx.fill();
                ctx.shadowBlur = 0;
                
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 9px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(`Node ${n.id + 1}`, n.x, n.y - 16);
            });
            
            requestAnimationFrame(drawDecentralized);
        }
        drawDecentralized();
    }
}

/* ==========================================================================
   Block Creation Mempool & Proof of Work Miner
   ========================================================================== */
function initMempoolAndMiner() {
    const mempoolListEl = document.getElementById("mempool-list-element");
    const mempoolCounterEl = document.getElementById("mempool-counter");
    const sendTxBtn = document.getElementById("btn-sim-send-tx");
    
    const mineTxArea = document.getElementById("mine-block-txs");
    const mineBlockNumInput = document.getElementById("mine-block-num");
    const minePrevHashInput = document.getElementById("mine-prev-hash");
    const mineDifficultySelect = document.getElementById("mine-difficulty");
    const mineNonceInput = document.getElementById("mine-nonce");
    const mineHashValEl = document.getElementById("mine-hash-val");
    const triggerMineBtn = document.getElementById("btn-trigger-mining");
    const mineShimmer = document.getElementById("mine-shimmer");
    const minerPanel = document.getElementById("miner-container-panel");
    const visualBlockchainRow = document.getElementById("visual-blockchain-row");
    const demoBlockBtn = document.getElementById("btn-demo-add-block");

    let mempoolTransactions = [
        { from: "0x4facfe... ", to: "0x3c3c3d... ", amount: 0.8 },
        { from: "0xb92b27... ", to: "0x1565c0... ", amount: 2.1 },
        { from: "0x00f2fe... ", to: "0x10b981... ", amount: 1.5 },
        { from: "0xa855f7... ", to: "0xef4444... ", amount: 0.3 },
    ];
    
    let blockCount = 4;
    let lastMinedHash = "00002f1a6c4b901aefbcde8740c2194fe9b0b471c210b7f83a48e718696c21e7";
    let isMining = false;

    // 1. Update Mempool UI
    function renderMempool() {
        if (!mempoolListEl) return;
        mempoolListEl.innerHTML = "";
        mempoolCounterEl.textContent = `${mempoolTransactions.length} TX Pending`;
        
        mempoolTransactions.forEach((tx, idx) => {
            const li = document.createElement("li");
            li.className = "mempool-tx-item";
            li.innerHTML = `
                <div class="tx-addresses">
                    <span class="tx-addr" title="${tx.from}">From: ${tx.from}</span>
                    <span class="tx-arrow">➔</span>
                    <span class="tx-addr" title="${tx.to}">To: ${tx.to}</span>
                </div>
                <span class="tx-value">${tx.amount} BTC</span>
            `;
            mempoolListEl.appendChild(li);
        });

        // Set transactions queue into miner panel data
        if (mempoolTransactions.length > 0) {
            mineTxArea.value = mempoolTransactions.map(tx => `${tx.from.substring(0,6)}..->${tx.to.substring(0,6)}.. (${tx.amount} BTC)`).join("\n");
        } else {
            mineTxArea.value = "No transactions in Mempool.";
        }
    }
    renderMempool();

    // Send random transaction button
    if (sendTxBtn) {
        sendTxBtn.addEventListener("click", () => {
            const addressPool = ["0x4facfe", "0x3c3c3d", "0xb92b27", "0x1565c0", "0x00f2fe", "0xa855f7", "0x10b981", "0xef4444"];
            const from = addressPool[Math.floor(Math.random() * addressPool.length)] + "...";
            let to = addressPool[Math.floor(Math.random() * addressPool.length)] + "...";
            while (from === to) {
                to = addressPool[Math.floor(Math.random() * addressPool.length)] + "...";
            }
            const amount = parseFloat((Math.random() * 3 + 0.1).toFixed(2));
            
            mempoolTransactions.push({ from, to, amount });
            renderMempool();
        });
    }

    // Try Mining Block puzzle
    if (triggerMineBtn) {
        triggerMineBtn.addEventListener("click", () => {
            if (isMining) return;
            if (mempoolTransactions.length === 0) {
                alert("The mempool is empty! Add a transaction to mine a block.");
                return;
            }
            
            isMining = true;
            triggerMineBtn.disabled = true;
            triggerMineBtn.querySelector("span").textContent = "Mining Block...";
            mineShimmer.style.display = "block";
            
            const targetDifficulty = parseInt(mineDifficultySelect.value);
            const targetPrefix = "0".repeat(targetDifficulty);
            
            const blockNum = mineBlockNumInput.value;
            const prevHash = minePrevHashInput.value;
            const dataString = mineTxArea.value;
            
            let nonce = 0;
            let currentHash = "";
            
            // Guess loop using animation loops
            function mineStep() {
                // Batch hashes for rendering speed
                for (let i = 0; i < 75; i++) {
                    const content = blockNum + prevHash + dataString + nonce;
                    currentHash = sha256(content);
                    
                    if (currentHash.startsWith(targetPrefix)) {
                        // Solved!
                        mineNonceInput.value = nonce;
                        mineHashValEl.textContent = currentHash;
                        mineHashValEl.className = "hash-value success";
                        
                        // Stop mining animation
                        isMining = false;
                        triggerMineBtn.disabled = false;
                        triggerMineBtn.querySelector("span").textContent = "Try Mining Block";
                        mineShimmer.style.display = "none";
                        minerPanel.classList.add("mined");
                        
                        // Append solved block to physical chain
                        appendMinedBlock(blockNum, prevHash, dataString, nonce, currentHash);
                        
                        // Clear successfully mined mempool txs & increment miner forms
                        mempoolTransactions = [];
                        renderMempool();
                        lastMinedHash = currentHash;
                        
                        setTimeout(() => {
                            minerPanel.classList.remove("mined");
                            blockCount++;
                            mineBlockNumInput.value = `#${blockCount}`;
                            minePrevHashInput.value = lastMinedHash.substring(0, 32) + "...";
                        }, 2500);
                        return;
                    }
                    nonce++;
                }
                
                // Update UI state with quick tick
                mineNonceInput.value = nonce;
                mineHashValEl.textContent = currentHash;
                
                if (isMining) {
                    requestAnimationFrame(mineStep);
                }
            }
            mineStep();
        });
    }

    function appendMinedBlock(blockNum, prevHash, dataString, nonce, currentHash) {
        if (!visualBlockchainRow) return;
        
        // Arrow
        const arrow = document.createElement("div");
        arrow.className = "blockchain-connector-arrow";
        arrow.textContent = "➔";
        visualBlockchainRow.appendChild(arrow);
        
        // New block card
        const card = document.createElement("div");
        card.className = "visual-block-card new-block";
        card.innerHTML = `
            <h5>BLOCK ${blockNum}</h5>
            <div class="visual-block-fields">
                <div class="visual-block-field">
                    <span class="field-label">Prev Hash:</span>
                    <span class="field-value hash" title="${prevHash}">${prevHash.substring(0, 10)}...</span>
                </div>
                <div class="visual-block-field">
                    <span class="field-label">Data:</span>
                    <span class="field-value">${dataString.split("\n")[0]}</span>
                </div>
                <div class="visual-block-field">
                    <span class="field-label">Nonce:</span>
                    <span class="field-value">${nonce}</span>
                </div>
                <div class="visual-block-field">
                    <span class="field-label">Hash:</span>
                    <span class="field-value hash" title="${currentHash}">${currentHash.substring(0, 12)}...</span>
                </div>
            </div>
        `;
        visualBlockchainRow.appendChild(card);
        
        // Auto-scroll block explorer to right
        visualBlockchainRow.scrollLeft = visualBlockchainRow.scrollWidth;
    }

    // Mini simulation add block button in Section 2
    if (demoBlockBtn) {
        demoBlockBtn.addEventListener("click", () => {
            appendMinedBlock("#Demo", lastMinedHash.substring(0, 16), "Simulated Block Transfer", 9999, "0000a12cf49...");
        });
    }
}
