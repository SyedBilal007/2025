const yesBtn = document.querySelector(".yes-btn");
const noBtn = document.querySelector(".no-btn");
const question = document.querySelector(".question");
const gif = document.querySelector(".gif");
const heartsContainer = document.querySelector(".hearts-container");
const confettiCanvas = document.getElementById("confetti-canvas");
const ctx = confettiCanvas.getContext("2d");
const wrapper = document.querySelector(".wrapper");

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Detect mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                 (window.innerWidth <= 768 && 'ontouchstart' in window);

// Set canvas size with device pixel ratio for crisp rendering
function setCanvasSize() {
    const dpr = window.devicePixelRatio || 1;
    confettiCanvas.width = window.innerWidth * dpr;
    confettiCanvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    confettiCanvas.style.width = window.innerWidth + 'px';
    confettiCanvas.style.height = window.innerHeight + 'px';
}

setCanvasSize();

// Create floating hearts with performance optimization
function createFloatingHearts() {
    if (prefersReducedMotion) return;
    
    const heartSymbols = ['💕', '💖', '💗', '💓', '💝', '💘', '❤️', '💞'];
    const isSmallScreen = window.innerWidth <= 480;
    const maxHeartsOnScreen = isSmallScreen ? 18 : 30;
    const spawnInterval = isSmallScreen ? 3000 : 2000;
    const initialCount = isSmallScreen ? 10 : 20;
    
    let heartsOnScreen = 0;
    
    // Initial hearts
    for (let i = 0; i < initialCount; i++) {
        setTimeout(() => {
            if (heartsOnScreen < maxHeartsOnScreen) {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
                heart.style.left = Math.random() * 100 + '%';
                heart.style.animationDelay = Math.random() * 15 + 's';
                heart.style.animationDuration = (10 + Math.random() * 10) + 's';
                heartsContainer.appendChild(heart);
                heartsOnScreen++;
                
                // Remove heart after animation
                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.remove();
                        heartsOnScreen--;
                    }
                }, 25000);
            }
        }, i * 500);
    }
    
    // Keep creating hearts with rate limiting
    const heartInterval = setInterval(() => {
        if (heartsOnScreen < maxHeartsOnScreen) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDelay = '0s';
            heart.style.animationDuration = (10 + Math.random() * 10) + 's';
            heartsContainer.appendChild(heart);
            heartsOnScreen++;
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.remove();
                    heartsOnScreen--;
                }
            }, 25000);
        }
    }, spawnInterval);
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        clearInterval(heartInterval);
    });
}

// Confetti animation with mobile optimization
function createConfetti() {
    if (prefersReducedMotion) return;
    
    const colors = ['#ff6b9d', '#ffc3a0', '#ffafbd', '#ff9a9e', '#fecfef', '#fec8d8'];
    const confetti = [];
    const isSmallScreen = window.innerWidth <= 480;
    const confettiCount = isSmallScreen ? 80 : 150;
    
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * confettiCanvas.width,
            y: -10,
            r: Math.random() * 6 + 2,
            d: Math.random() * confettiCount,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngleIncrement: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    
    function drawConfetti() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        confetti.forEach((conf, index) => {
            ctx.beginPath();
            ctx.lineWidth = conf.r / 2;
            ctx.strokeStyle = conf.color;
            ctx.moveTo(conf.x + conf.tilt + conf.r, conf.y);
            ctx.lineTo(conf.x + conf.tilt, conf.y + conf.tilt + conf.r);
            ctx.stroke();
            
            conf.tiltAngle += conf.tiltAngleIncrement;
            conf.y += (Math.cos(conf.d) + 3 + conf.r / 2) / 2;
            conf.tilt = Math.sin(conf.tiltAngle) * 15;
            
            if (conf.y > confettiCanvas.height) {
                confetti.splice(index, 1);
            }
        });
        
        if (confetti.length > 0) {
            requestAnimationFrame(drawConfetti);
        }
    }
    
    drawConfetti();
}

// Typing animation
function typeText(element, text, speed = 50) {
    element.textContent = '';
    element.classList.add('typing');
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.remove('typing');
        }
    }
    
    type();
}

// Change text and gif when the Yes button is clicked
yesBtn.addEventListener("click", () => {
    // Add celebration animation
    question.classList.add('celebrate');
    gif.classList.add('celebrate');
    
    // Create confetti
    createConfetti();
    
    // Hide the No button with animation
    noBtn.classList.add('hide');
    
    setTimeout(() => {
        // Change GIF with fade effect
        gif.style.opacity = '0';
        setTimeout(() => {
            gif.src = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGNhdXh1b252b2F2b2U4cHRlNGkwMDZsajllaGF1cDJyb2p4NXl2YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/G6N0pDDgDpLjUvNoyQ/giphy.gif";
            gif.style.opacity = '1';
        }, 300);
        
        // Type the new message
        setTimeout(() => {
            typeText(question, "Being with you is my biggest blessing. I love you. 💕", 30);
        }, 500);
        
        // Hide No button completely
        setTimeout(() => {
            noBtn.style.display = "none";
        }, 500);
    }, 100);
    
    // Remove celebration class after animation
    setTimeout(() => {
        question.classList.remove('celebrate');
        gif.classList.remove('celebrate');
    }, 600);
});

// Function to move No button to random position within bounds
function moveNoButton() {
    const wrapperRect = wrapper.getBoundingClientRect();
    const noBtnRect = noBtn.getBoundingClientRect();
    
    // Get button's actual dimensions
    const btnWidth = noBtnRect.width;
    const btnHeight = noBtnRect.height;
    
    // Calculate available space with padding (15px on each side for safety)
    const padding = 15;
    const maxX = wrapperRect.width - btnWidth - (padding * 2);
    const maxY = wrapperRect.height - btnHeight - (padding * 2);
    
    // Ensure we have valid bounds
    if (maxX <= 0 || maxY <= 0) return;
    
    // Generate random position within bounds (relative to wrapper)
    const randomX = padding + Math.floor(Math.random() * maxX);
    const randomY = padding + Math.floor(Math.random() * maxY);
    
    // Get current position relative to wrapper
    const currentX = noBtnRect.left - wrapperRect.left;
    const currentY = noBtnRect.top - wrapperRect.top;
    
    // Calculate translate values (relative to current position)
    const translateX = randomX - currentX;
    const translateY = randomY - currentY;
    
    // Apply transform with smooth transition
    noBtn.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    noBtn.style.transform = `translate(${translateX}px, ${translateY}px)`;
    
    // Add shake effect
    noBtn.style.animation = 'shake 0.5s';
    
    // Remove shake animation after it completes
    setTimeout(() => {
        noBtn.style.animation = '';
    }, 500);
}

// Desktop: move on hover (mouseenter)
noBtn.addEventListener("mouseenter", (e) => {
    if (!isMobile) {
        e.preventDefault();
        moveNoButton();
    }
});

// Mobile/Touch: move on touch/pointer down
let touchMoved = false;

noBtn.addEventListener("pointerdown", (e) => {
    if (isMobile) {
        e.preventDefault();
        touchMoved = false;
        moveNoButton();
    }
});

noBtn.addEventListener("touchstart", (e) => {
    if (isMobile) {
        e.preventDefault();
        touchMoved = false;
        moveNoButton();
    }
}, { passive: false });

// Prevent default touch behavior to avoid scrolling/zooming
noBtn.addEventListener("touchmove", (e) => {
    if (isMobile) {
        e.preventDefault();
        touchMoved = true;
    }
}, { passive: false });

noBtn.addEventListener("touchend", (e) => {
    if (isMobile && !touchMoved) {
        e.preventDefault();
    }
}, { passive: false });

// Initialize No button position
noBtn.style.left = 'auto';
noBtn.style.right = 'auto';
noBtn.style.top = 'auto';
noBtn.style.bottom = 'auto';

// Initialize floating hearts on page load
window.addEventListener('load', () => {
    createFloatingHearts();
});

// Resize canvas on window resize with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        setCanvasSize();
        // Reset No button position if it goes out of bounds
        const wrapperRect = wrapper.getBoundingClientRect();
        const noBtnRect = noBtn.getBoundingClientRect();
        if (noBtnRect.right > wrapperRect.right || noBtnRect.bottom > wrapperRect.bottom) {
            noBtn.style.transform = 'translate(0, 0)';
        }
    }, 250);
});