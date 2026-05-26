/* ==========================================================================
   BLOCKCHAIN & WEB3 EDUCATIONAL HUB - QUIZ & GLOSSARY (quiz.js)
   Controls: Multiple-choice quiz, dynamic Canvas certificate generator, glossary.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initGlossary();
    initQuizEvents();
});

/* ==========================================================================
   Web3 Educational Glossary Database & Search Engine
   ========================================================================== */
const glossaryData = [
    { term: "Blockchain", definition: "A shared, immutable ledger that records transaction logs across a distributed network of computers, secured by cryptographic link hashes." },
    { term: "Smart Contract", definition: "A self-executing computer program deployed to a blockchain that automatically runs rules exactly as coded without third-party interference." },
    { term: "Cryptographic Hash", definition: "A unique, fixed-size mathematical signature (like SHA-256) generated from raw input data. Any tiny file edit completely alters the output hash." },
    { term: "EVM", definition: "Ethereum Virtual Machine. The global, decentralized runtime environment that compiles and executes Ethereum smart contract software scripts." },
    { term: "Mempool", definition: "Memory Pool. A temporary database where nodes store signed transactions before they are validated and mined into a block." },
    { term: "Double Spending", definition: "The risk of spending a single digital token twice. Blockchains prevent this by using distributed ledgers to verify history before approving a block." },
    { term: "UTXO", definition: "Unspent Transaction Output. Bitcoin's database model where balances are tracked as unspent cash fragments rather than single account states." },
    { term: "Proof of Work", definition: "A consensus algorithm where miners compete to solve computationally heavy cryptographic puzzles to validate transactions and secure blocks." },
    { term: "Proof of Stake", definition: "An energy-efficient consensus algorithm where validators are selected to propose blocks based on the amount of capital tokens they lock up (stake)." },
    { term: "Gas Fee", definition: "The computational fee paid in Ether to execute smart contracts or send transfers on the Ethereum network, preventing system spam." },
    { term: "Stablecoin", definition: "A cryptocurrency engineered to maintain a fixed value pegged to standard assets (like the US Dollar) using reserves or algorithms." },
    { term: "Consensus Mechanism", definition: "The mathematical process (e.g. PoW, PoS) through which distributed, trustless peers reach absolute agreement on the single valid state of a ledger." }
];

function initGlossary() {
    const searchInput = document.getElementById("glossary-search");
    const container = document.getElementById("glossary-container");

    if (!container) return;

    function renderGlossary(filterText = "") {
        container.innerHTML = "";
        const filtered = glossaryData.filter(item => 
            item.term.toLowerCase().includes(filterText.toLowerCase()) || 
            item.definition.toLowerCase().includes(filterText.toLowerCase())
        );

        if (filtered.length === 0) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #64748b; font-style: italic;">No glossary terms found matching "${filterText}"</div>`;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement("div");
            card.className = "glossary-card";
            card.innerHTML = `
                <div class="glossary-term">${item.term}</div>
                <div class="glossary-definition">${item.definition}</div>
            `;
            container.appendChild(card);
        });
    }
    renderGlossary();

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            renderGlossary(e.target.value);
        });
    }
}

/* ==========================================================================
   Interactive Modular Quiz Engine
   ========================================================================== */
const quizQuestions = [
    {
        question: "What makes a blockchain immutable (impossible to secretly edit)?",
        options: [
            "All files are stored in a centralized Google Drive server.",
            "Each block contains the cryptographic hash of the prior block, linking them permanently.",
            "Only the original developer Satoshi Nakamoto holds the master password.",
            "It is backed by physical gold bars inside bank vault reserves."
        ],
        answer: 1
    },
    {
        question: "Which of the following describes the key characteristic of Web3?",
        options: [
            "A read-only internet of static websites with zero user database connections.",
            "A read and write internet fully controlled and monetized by social corporate giants.",
            "A decentralized read-write-own internet secured by wallets and cryptography.",
            "A global, private internet only accessible via special bank terminals."
        ],
        answer: 2
    },
    {
        question: "What is the primary vulnerability (single point of failure) in a centralized system?",
        options: [
            "It uses multiple node servers situated in different countries.",
            "If the central coordinate server crashes or gets hacked, the entire system collapses.",
            "Transactions are too slow because nodes must reach mathematical consensus.",
            "It relies heavily on public wallets and open-source smart contract code."
        ],
        answer: 1
    },
    {
        question: "What does 'Mempool' represent in blockchain systems?",
        options: [
            "A database storing all historical block reward statistics.",
            "A pool of staked coins locked up by validators on Ethereum.",
            "A temporary waiting area for signed transactions pending validator mining.",
            "An online forum where miners chat and pool their computing power."
        ],
        answer: 2
    },
    {
        question: "How does Proof of Work (PoW) validate blockchain ledgers?",
        options: [
            "Users vote in democratic boardrooms to approve transactions.",
            "Miners spend hardware power and electricity to solve cryptographic hash puzzles.",
            "Government organizations issue digital approval certificates to miners.",
            "A central bank server signs each block dynamically using private databases."
        ],
        answer: 1
    },
    {
        question: "What is a 'Smart Contract' on Ethereum?",
        options: [
            "A legal document signed with real pen signatures in physical courts.",
            "A computer program compiled to the EVM that auto-runs transaction rules.",
            "A wallet address designed to hold only USDC stablecoins.",
            "An algorithm that dynamically changes Bitcoin block difficulties."
        ],
        answer: 1
    },
    {
        question: "How does Proof of Stake (PoS) select block validators?",
        options: [
            "By choosing the server with the fastest internet bandwidth speeds.",
            "By selecting developers who write the best smart contract code.",
            "Based on the amount of capital tokens validators lock up (stake) in the network.",
            "Through a random draw where every wallet has an equal 1% chance."
        ],
        answer: 2
    },
    {
        question: "What is the primary characteristic of Bitcoin's UTXO model?",
        options: [
            "Balances are recorded as a single balance registry entry in a bank sheet.",
            "Accounts are split between EOAs and Smart Contract codes.",
            "Balances are computed as the sum of unspent cash output fragments.",
            "It requires paying gas denominated in Gwei for every coin transfer."
        ],
        answer: 2
    },
    {
        question: "Why do stablecoins like USDT and USDC exist?",
        options: [
            "To offer high-risk investment vehicles that double in price daily.",
            "To mitigate crypto price volatility by pegging their value to the US Dollar.",
            "To replace Bitcoin mining with centralized bank-approved currencies.",
            "To serve as reward tokens for solving Proof of Stake roulette wheels."
        ],
        answer: 1
    },
    {
        question: "What are ERC-20 stablecoin Transfer event logs used for?",
        options: [
            "To calculate the daily hash puzzles difficulty for Bitcoin miners.",
            "To record contract transactions (Sender, Recipient, Amount) as readable logs.",
            "To download validator certification JPGs onto personal devices.",
            "To secure private blockchains against open-source public access."
        ],
        answer: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;
let hasSelected = false;

const introBox = document.getElementById("quiz-intro-box");
const questionBox = document.getElementById("quiz-question-box");
const certBox = document.getElementById("quiz-certificate-box");
const qText = document.getElementById("quiz-question-target");
const qOptions = document.getElementById("quiz-options-container");
const qCounter = document.getElementById("quiz-counter");
const qProgress = document.getElementById("quiz-bar-fill");
const qScoreIndicator = document.getElementById("quiz-score-indicator");
const nextBtn = document.getElementById("btn-next-question");

function initQuizEvents() {
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizQuestions.length) {
                showQuestion();
            } else {
                finishQuiz();
            }
        });
    }
}

window.startQuiz = function() {
    if (!introBox || !questionBox) return;
    introBox.style.display = "none";
    questionBox.style.display = "block";
    certBox.style.display = "none";
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
};

function showQuestion() {
    hasSelected = false;
    nextBtn.disabled = true;
    
    const q = quizQuestions[currentQuestionIndex];
    qCounter.textContent = `QUESTION ${currentQuestionIndex + 1} OF ${quizQuestions.length}`;
    qProgress.style.width = `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`;
    qScoreIndicator.textContent = `Score: ${score}/${quizQuestions.length}`;
    
    qText.textContent = q.question;
    qOptions.innerHTML = "";

    q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "quiz-option-btn";
        btn.textContent = opt;
        btn.addEventListener("click", () => selectOption(btn, idx));
        qOptions.appendChild(btn);
    });
}

function selectOption(selectedBtn, idx) {
    if (hasSelected) return;
    hasSelected = true;

    const q = quizQuestions[currentQuestionIndex];
    const optionButtons = qOptions.querySelectorAll(".quiz-option-btn");

    if (idx === q.answer) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
        // Highlight correct option
        optionButtons[q.answer].classList.add("correct");
    }

    qScoreIndicator.textContent = `Score: ${score}/${quizQuestions.length}`;
    nextBtn.disabled = false;
}

function finishQuiz() {
    questionBox.style.display = "none";
    certBox.style.display = "block";

    const finalScoreEl = document.getElementById("cert-final-score");
    const certWrapperCard = document.getElementById("cert-wrapper-card");
    const certInputRow = document.querySelector(".cert-input-row");
    
    finalScoreEl.textContent = `${score}/${quizQuestions.length}`;

    if (score >= 8) {
        // Passed! Show cert generation fields
        certWrapperCard.style.borderColor = "var(--neon-green)";
        certWrapperCard.style.background = "rgba(16, 185, 129, 0.03)";
        certInputRow.style.display = "flex";
        initCertificateGenerator();
    } else {
        // Failed
        certWrapperCard.style.borderColor = "var(--neon-red)";
        certWrapperCard.style.background = "rgba(239, 68, 68, 0.03)";
        certInputRow.style.display = "none";
        
        const certMessage = certWrapperCard.querySelector("p");
        certMessage.innerHTML = `You scored <span style="font-weight: bold; color: var(--neon-red);">${score}/10</span>. You need at least 8/10 to graduate and earn a blockchain certificate.`;
        
        // Change generate button to a retry button
        const retryRow = document.createElement("div");
        retryRow.style.marginTop = "1.5rem";
        retryRow.innerHTML = `<button class="btn btn-primary" onclick="startQuiz()">Try Again</button>`;
        certWrapperCard.appendChild(retryRow);
    }
}

/* ==========================================================================
   Canvas Cryptographic Graduation Certificate Builder
   ========================================================================== */
function initCertificateGenerator() {
    const certNameInput = document.getElementById("cert-user-name");
    const btnGenCert = document.getElementById("btn-generate-cert-png");
    const canvasWrapper = document.getElementById("canvas-wrapper-box");
    const canvas = document.getElementById("certificate-canvas");
    const btnDownload = document.getElementById("btn-download-cert");

    if (!btnGenCert || !canvas) return;

    const ctx = canvas.getContext("2d");

    btnGenCert.addEventListener("click", () => {
        const userName = certNameInput.value.trim() || "Web3 Graduate";
        canvasWrapper.style.display = "block";
        
        drawCertificate(userName);
        
        // Scroll down to display certificate
        canvasWrapper.scrollIntoView({ behavior: "smooth" });
    });

    function drawCertificate(name) {
        const w = canvas.width;
        const h = canvas.height;

        // 1. Dark Futuristic Cyber Background
        ctx.fillStyle = "#04060d";
        ctx.fillRect(0, 0, w, h);

        // Grid lines effect in background
        ctx.strokeStyle = "rgba(0, 242, 254, 0.03)";
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < w; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // 2. Cyan & Purple Glowing Border
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, "#00f2fe");
        gradient.addColorStop(0.5, "#a855f7");
        gradient.addColorStop(1, "#fbbf24");
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 10;
        ctx.strokeRect(15, 15, w - 30, h - 30);

        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 1;
        ctx.strokeRect(25, 25, w - 50, h - 50);

        // 3. Header Logo & Elements
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 26px 'Outfit', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("BLOCKCHAIN & WEB3 ACADEMY", w / 2, 85);

        ctx.fillStyle = "rgba(0, 242, 254, 0.6)";
        ctx.font = "11px monospace";
        ctx.fillText("SYSTEM CODE: GRAD_EVM_2026", w / 2, 110);

        // 4. Main Body Text
        ctx.fillStyle = "#94a3b8";
        ctx.font = "italic 16px sans-serif";
        ctx.fillText("This cryptographically signed document certifies that", w / 2, 175);

        // Graduate Name (Large, neon gold gradient)
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 38px 'Outfit', sans-serif";
        ctx.fillText(name.toUpperCase(), w / 2, 240);

        ctx.strokeStyle = "rgba(251, 191, 36, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(w / 2 - 180, 260);
        ctx.lineTo(w / 2 + 180, 260);
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "15px sans-serif";
        ctx.fillText("has successfully passed the core examinations and demonstrated advanced mastery of", w / 2, 305);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("Blockchain Ledgers, Cryptographic Hashes, UTXOs, EVM Smart Contracts, and DeFi Systems.", w / 2, 335);

        // 5. Verification QR Placeholder & Signature details
        const randHash = "sig_0x" + Array.from({length: 24}, () => Math.floor(Math.random()*16).toString(16)).join("");
        
        ctx.fillStyle = "rgba(168, 85, 247, 0.6)";
        ctx.font = "10px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`VERIFICATION HASH:`, 60, h - 85);
        ctx.fillStyle = "#e2e8f0";
        ctx.fillText(randHash, 60, h - 70);

        // Draw a simulated cryptographic QR square block graphic on the right
        const qrSize = 65;
        const qrX = w - 125;
        const qrY = h - 110;
        
        ctx.fillStyle = "#0c0f1d";
        ctx.fillRect(qrX, qrY, qrSize, qrSize);
        ctx.strokeStyle = "rgba(0,242,254,0.3)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(qrX, qrY, qrSize, qrSize);

        // Draw block grid modules inside QR placeholder
        ctx.fillStyle = "var(--neon-cyan)";
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                if ((i + j) % 2 === 0 || (i === 0 && j === 0) || (i === 5 && j === 5)) {
                    ctx.fillRect(qrX + 5 + i * 9, qrY + 5 + j * 9, 7, 7);
                }
            }
        }

        // Signature on center-right
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = "italic 13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Antigravity AI Engine", w / 2 + 50, h - 85);
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.beginPath();
        ctx.moveTo(w / 2 - 30, h - 75);
        ctx.lineTo(w / 2 + 130, h - 75);
        ctx.stroke();
        ctx.font = "9px monospace";
        ctx.fillText("SIGNED VALIDATOR KEY", w / 2 + 50, h - 62);
    }

    // JPG Download Trigger
    btnDownload.addEventListener("click", () => {
        const dataUrl = canvas.toDataURL("image/jpeg");
        const link = document.createElement("a");
        link.download = "blockchain_graduation_certificate.jpg";
        link.href = dataUrl;
        link.click();
    });
}

/* ==========================================================================
   Section 20 - Smart Contract Mock IDE Playground
   ========================================================================== */
const templates = {
    "simple-token": `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    string public name = "SimpleToken";
    mapping(address => uint256) public balances;

    constructor() {
        balances[msg.sender] = 1000;
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }
}`,
    "simple-voting": `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleVoting {
    mapping(string => uint256) public votes;
    mapping(address => bool) public hasVoted;

    function vote(string memory candidate) public {
        require(!hasVoted[msg.sender], "Already voted!");
        votes[candidate] += 1;
        hasVoted[msg.sender] = true;
    }

    function getVotes(string memory candidate) public view returns (uint256) {
        return votes[candidate];
    }
}`
};

const ideSelector = document.getElementById("ide-template-selector");
const solidityText = document.getElementById("solidity-textarea");
const btnDeploy = document.getElementById("btn-ide-deploy");
const functionsContainer = document.getElementById("ide-functions-container");
const ideConsole = document.getElementById("ide-console");

if (ideSelector && solidityText) {
    ideSelector.addEventListener("change", (e) => {
        const val = e.target.value;
        solidityText.value = templates[val];
        
        // Reset deploy status
        functionsContainer.style.display = "none";
        ideConsole.className = "ide-console-log";
        ideConsole.textContent = `[SYSTEM] Ready to deploy ${val === "simple-token" ? "SimpleToken" : "SimpleVoting"} to EVM...`;
        btnDeploy.disabled = false;
        btnDeploy.querySelector("span").textContent = "Deploy Contract";
    });

    let mockBalances = {
        deployer: 1000,
        recipient: 0
    };
    let deployedTemplate = "simple-token";

    btnDeploy.addEventListener("click", () => {
        deployedTemplate = ideSelector.value;
        btnDeploy.disabled = true;
        btnDeploy.querySelector("span").textContent = "Compiled & Deployed";
        
        ideConsole.textContent = `[COMPILING] solidity compiler v0.8.0 loaded...\n[SUCCESS] Contract deployed to EVM at 0x${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join("")}\n[STATE] Initial state loaded successfully.`;
        ideConsole.className = "ide-console-log";
        
        // Load custom interactive button triggers depending on the selected solidity template
        renderIdeInteractiveFunctions(deployedTemplate);
    });

    function renderIdeInteractiveFunctions(template) {
        functionsContainer.style.display = "block";
        functionsContainer.innerHTML = "";

        if (template === "simple-token") {
            mockBalances = { deployer: 1000, recipient: 0 };
            
            functionsContainer.innerHTML = `
                <div class="contract-btn-row">
                    <button class="btn btn-secondary" id="btn-ide-call-balance" style="font-size: 0.75rem; padding: 0.4rem 1rem; width: 120px;">balances()</button>
                    <select id="ide-balance-select" class="form-input" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; width: 140px;">
                        <option value="deployer">Deployer Wallet</option>
                        <option value="recipient">Recipient Wallet</option>
                    </select>
                </div>
                <div class="contract-btn-row" style="margin-top: 0.5rem;">
                    <button class="btn btn-primary" id="btn-ide-call-transfer" style="font-size: 0.75rem; padding: 0.4rem 1rem; width: 120px; background: linear-gradient(135deg, var(--neon-purple) 0%, #1565c0 100%); border:none;">transfer()</button>
                    <input type="text" class="form-input" disabled value="0x3c3c3d0b21a8c3d3f90ab94c718a2c3df40f1a92" style="font-size: 0.75rem; padding: 0.35rem 0.5rem;">
                    <input type="number" id="ide-transfer-amount" class="form-input" value="100" style="font-size: 0.75rem; padding: 0.35rem 0.5rem; width: 80px;">
                </div>
            `;

            // Bind triggers
            document.getElementById("btn-ide-call-balance").addEventListener("click", () => {
                const target = document.getElementById("ide-balance-select").value;
                const bal = mockBalances[target];
                appendIdeConsole(`[CALL] balances(${target === "deployer" ? "0x4facfe..." : "0x3c3c3d..."}) -> uint256: ${bal}`);
            });

            document.getElementById("btn-ide-call-transfer").addEventListener("click", () => {
                const amt = parseInt(document.getElementById("ide-transfer-amount").value) || 0;
                if (mockBalances.deployer < amt) {
                    appendIdeConsole(`[EVM REVERT] require failed: Insufficient balance.`);
                    return;
                }
                
                mockBalances.deployer -= amt;
                mockBalances.recipient += amt;
                
                appendIdeConsole(`[TRANSACTION] transfer(to: 0x3c3c3d..., amount: ${amt})\n[EVM EVENT] Transfer(from: 0x4facfe..., to: 0x3c3c3d..., value: ${amt})\n[SUCCESS] Block sealing finalized.`);
            });

        } else if (template === "simple-voting") {
            let mockVotes = { Alice: 0, Bob: 0 };
            let hasUserVoted = false;

            functionsContainer.innerHTML = `
                <div class="contract-btn-row">
                    <button class="btn btn-secondary" id="btn-ide-call-votes" style="font-size: 0.75rem; padding: 0.4rem 1rem; width: 120px;">getVotes()</button>
                    <select id="ide-votes-select" class="form-input" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; width: 140px;">
                        <option value="Alice">Alice (Candidate)</option>
                        <option value="Bob">Bob (Candidate)</option>
                    </select>
                </div>
                <div class="contract-btn-row" style="margin-top: 0.5rem;">
                    <button class="btn btn-primary" id="btn-ide-call-vote" style="font-size: 0.75rem; padding: 0.4rem 1rem; width: 120px; background: linear-gradient(135deg, var(--neon-purple) 0%, #1565c0 100%); border:none;">vote()</button>
                    <select id="ide-vote-select" class="form-input" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; width: 140px;">
                        <option value="Alice">Vote Alice</option>
                        <option value="Bob">Vote Bob</option>
                    </select>
                </div>
            `;

            // Bind triggers
            document.getElementById("btn-ide-call-votes").addEventListener("click", () => {
                const target = document.getElementById("ide-votes-select").value;
                const count = mockVotes[target];
                appendIdeConsole(`[CALL] getVotes(candidate: "${target}") -> uint256: ${count}`);
            });

            document.getElementById("btn-ide-call-vote").addEventListener("click", () => {
                if (hasUserVoted) {
                    appendIdeConsole(`[EVM REVERT] require failed: Already voted!`);
                    return;
                }
                
                const target = document.getElementById("ide-vote-select").value;
                mockVotes[target] += 1;
                hasUserVoted = true;
                
                appendIdeConsole(`[TRANSACTION] vote(candidate: "${target}")\n[SUCCESS] Votes registered successfully.`);
            });
        }
    }

    function appendIdeConsole(txt) {
        ideConsole.textContent += "\n" + txt;
        // Auto scroll console
        ideConsole.scrollTop = ideConsole.scrollHeight;
    }
}

/* ==========================================================================
   Proof of Stake roulette validator dataset
   ========================================================================== */
const validatorPool = [
    { id: 1, name: "Validator CoreNode", stake: 3200, pct: "40%", color: "#00f2fe" },
    { id: 2, name: "Validator CyberStake", stake: 2400, pct: "30%", color: "#a855f7" },
    { id: 3, name: "Validator LedgerPro", stake: 1600, pct: "20%", color: "#fbbf24" },
    { id: 4, name: "Validator P2PSwarm", stake: 800, pct: "10%", color: "#ef4444" }
];

window.addEventListener("load", () => {
    initPoSValidatorWheel();
});

function initPoSValidatorWheel() {
    const listPanel = document.getElementById("validators-list-container");
    const wheelCanvas = document.getElementById("stake-wheel");
    const spinBtn = document.getElementById("btn-spin-validators");

    if (!listPanel || !wheelCanvas) return;

    const ctx = wheelCanvas.getContext("2d");
    const cx = wheelCanvas.width / 2;
    const cy = wheelCanvas.height / 2;
    const outerRadius = 130;

    let currentRotation = 0;
    let isSpinning = false;

    // Render list pool of validators
    function renderValidatorsList(winnerId = -1) {
        listPanel.innerHTML = `
            <h4 style="color: var(--neon-purple); border-bottom:1px solid var(--border-glass); padding-bottom:0.5rem; margin-bottom:0.75rem;">Staking Validator Pool</h4>
        `;
        validatorPool.forEach(val => {
            const isWinner = val.id === winnerId;
            const row = document.createElement("div");
            row.className = `validator-row ${isWinner ? "active-winner" : ""}`;
            row.innerHTML = `
                <div class="validator-info">
                    <div class="validator-color-badge" style="background: ${val.color};"></div>
                    <span>${val.name} (${val.stake} ETH Staked)</span>
                </div>
                <span class="validator-stake-pct">${val.pct} odds</span>
            `;
            listPanel.appendChild(row);
        });
    }
    renderValidatorsList();

    // Draw Validator color slices inside canvas
    function drawStakingWheel(rotationAngle = 0) {
        ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
        
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotationAngle);
        
        let startAngle = 0;
        
        const stakesDistribution = [0.4, 0.3, 0.2, 0.1]; // Maps to odds percentages

        validatorPool.forEach((val, idx) => {
            const sliceAngle = stakesDistribution[idx] * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, outerRadius, startAngle, startAngle + sliceAngle);
            ctx.fillStyle = val.color;
            ctx.globalAlpha = 0.75;
            ctx.fill();
            
            // Draw border line
            ctx.strokeStyle = "#04060d";
            ctx.lineWidth = 2.5;
            ctx.stroke();
            
            startAngle += sliceAngle;
        });

        // Center hub circle
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 2);
        ctx.fillStyle = "#04060d";
        ctx.globalAlpha = 1.0;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
    }
    drawStakingWheel();

    if (spinBtn) {
        spinBtn.addEventListener("click", () => {
            if (isSpinning) return;
            isSpinning = true;
            spinBtn.disabled = true;
            spinBtn.querySelector("span").textContent = "Evaluating odds...";

            const duration = 2500;
            const startTime = performance.now();
            const initialRotation = currentRotation;
            const extraSpins = 4 * 2 * Math.PI; // Spin around 4 full loops minimum
            
            // Pick validator winner using weighted odds
            const randVal = Math.random();
            let winnerId = 1;
            let targetWheelAngle = 0; // The angle pointing to target slice index

            if (randVal < 0.4) {
                winnerId = 1;
                // Target slice 0: arc 0 to 40% (angle 0 to 144 deg)
                // Center slice is ~72 deg (1.25 rad)
                targetWheelAngle = -1.25;
            } else if (randVal < 0.7) {
                winnerId = 2;
                // Target slice 1: arc 40% to 70% (angle 144 to 252 deg)
                // Center slice is ~198 deg (3.45 rad)
                targetWheelAngle = -3.45;
            } else if (randVal < 0.9) {
                winnerId = 3;
                // Target slice 2: arc 70% to 90% (angle 252 to 324 deg)
                // Center slice is ~288 deg (5.0 rad)
                targetWheelAngle = -5.0;
            } else {
                winnerId = 4;
                // Target slice 3: arc 90% to 100% (angle 324 to 360 deg)
                // Center slice is ~342 deg (5.96 rad)
                targetWheelAngle = -5.96;
            }

            const finalRotation = initialRotation + extraSpins + targetWheelAngle;

            function animateWheel(time) {
                const elapsed = time - startTime;
                const t = Math.min(elapsed / duration, 1);
                
                // Ease out cubic deceleration spin
                const easeOutCubic = 1 - Math.pow(1 - t, 3);
                currentRotation = initialRotation + (finalRotation - initialRotation) * easeOutCubic;
                
                drawStakingWheel(currentRotation);

                if (t < 1) {
                    requestAnimationFrame(animateWheel);
                } else {
                    isSpinning = false;
                    spinBtn.disabled = false;
                    spinBtn.querySelector("span").textContent = "Select Next Validator";
                    renderValidatorsList(winnerId);
                    
                    // Small popup notification alert
                    const winner = validatorPool.find(v => v.id === winnerId);
                    alert(`Proof of Stake validator selected!\n\nProposer: ${winner.name}\nStaking odds: ${winner.pct}\nBlock sealing rewards won: +0.05 ETH`);
                }
            }
            requestAnimationFrame(animateWheel);
        });
    }
}
