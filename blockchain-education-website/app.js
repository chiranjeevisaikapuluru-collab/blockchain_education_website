/* ==========================================================================
   BLOCKCHAIN & WEB3 EDUCATIONAL HUB - CORE SCRIPT (app.js)
   Controls: Navigation progress, scrollspy, hero node canvas, dynamic prices ticker.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initScrollAndSpy();
    initHeroCanvas();
    initPriceTicker();
    initTimestamp();
});

/* ==========================================================================
   Scroll Progress and Sidebar Scrollspy
   ========================================================================== */
function initScrollAndSpy() {
    const readingProgress = document.getElementById("reading-progress");
    const navItems = document.querySelectorAll(".sidebar-nav-item");
    const sections = Array.from(navItems).map(item => {
        const link = item.querySelector("a");
        const targetId = link.getAttribute("href");
        return document.querySelector(targetId);
    }).filter(sec => sec !== null);

    window.addEventListener("scroll", () => {
        // 1. Reading Progress Bar
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        readingProgress.style.width = scrolled + "%";

        // 2. Scrollspy - Highlight active sidebar link
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 180; // offset for top navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        if (!currentSectionId && sections.length > 0) {
            currentSectionId = sections[0].getAttribute("id");
        }

        navItems.forEach(item => {
            const link = item.querySelector("a");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
    });
}

/* ==========================================================================
   Hero Dynamic Canvas: Interactive Node Network (P2P Blockchain)
   ========================================================================== */
function initHeroCanvas() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    const maxParticles = 60;
    const connectionDistance = 120;
    const mouse = { x: null, y: null, radius: 150 };

    // Setup canvas size
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse
    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle blueprint
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.size = Math.random() * 2 + 1.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce on boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Mouse interaction (push slightly)
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 242, 254, 0.65)";
            ctx.shadowBlur = 6;
            ctx.shadowColor = "#00f2fe";
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }
    }

    // Populate particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    // Draw connecting lines
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const alpha = (1 - (dist / connectionDistance)) * 0.18;
                    ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            // Line from mouse to particle
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const alpha = (1 - (dist / mouse.radius)) * 0.25;
                    ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    // Main animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawConnections();
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   Dynamic Prices Ticker (Mock Random Walk)
   ========================================================================== */
function initPriceTicker() {
    const btcElement = document.getElementById("btc-price");
    const ethElement = document.getElementById("eth-price");
    const gasElement = document.getElementById("gas-price");

    let btcPrice = 67420.50;
    let ethPrice = 3845.20;
    let gasPrice = 24;

    setInterval(() => {
        // Generate small percentage changes (-0.05% to +0.06%)
        const btcDelta = btcPrice * ((Math.random() - 0.45) * 0.001);
        const ethDelta = ethPrice * ((Math.random() - 0.45) * 0.001);
        const gasDelta = Math.floor((Math.random() - 0.5) * 3);

        btcPrice += btcDelta;
        ethPrice += ethDelta;
        gasPrice = Math.max(12, Math.min(80, gasPrice + gasDelta));

        // Update DOM with color signals
        updateTickerEl(btcElement, btcPrice, "$", 2);
        updateTickerEl(ethElement, ethPrice, "$", 2);
        updateTickerEl(gasElement, gasPrice, "", 0, " Gwei");
    }, 4000);
}

function updateTickerEl(el, price, prefix, decimals, suffix = "") {
    if (!el) return;
    const oldText = el.textContent;
    const newText = prefix + price.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    
    el.textContent = newText;
    
    // Animate color flash based on increase/decrease
    const isUp = parseFloat(newText.replace(/[^0-9.]/g, '')) >= parseFloat(oldText.replace(/[^0-9.]/g, ''));
    if (isUp) {
        el.className = "ticker-green";
    } else {
        el.className = "ticker-red";
        el.style.color = "#ef4444";
        el.style.textShadow = "0 0 6px rgba(239, 68, 68, 0.3)";
        setTimeout(() => {
            el.style.color = "";
            el.style.textShadow = "";
            el.className = "ticker-green";
        }, 1500);
    }
}

/* ==========================================================================
   Explorer Timestamp Update
   ========================================================================== */
function initTimestamp() {
    const timestampEl = document.getElementById("explorer-timestamp");
    if (!timestampEl) return;
    
    function refreshTime() {
        const d = new Date();
        timestampEl.textContent = d.toUTCString();
    }
    refreshTime();
    setInterval(refreshTime, 1000);
}

/* ==========================================================================
   Global Hub Tab Selector
   ========================================================================== */
window.switchTab = function(tabId) {
    const navButtons = document.querySelectorAll(".tab-btn");
    const panes = document.querySelectorAll(".tab-pane");

    navButtons.forEach(btn => {
        if (btn.getAttribute("onclick").includes(tabId)) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    panes.forEach(pane => {
        if (pane.getAttribute("id") === tabId) {
            pane.classList.add("active");
        } else {
            pane.classList.remove("active");
        }
    });
};
