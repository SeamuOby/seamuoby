const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
let playerPosition = gameArea.offsetWidth / 2 - player.offsetWidth / 2;
let bullets = [];
let invaders = [];
let invaderBullets = [];
let invaderSpeed = 4; // Updated speed for invaders
let gameInterval;
let playerLives = 2;

// Mobile controls
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const shootButton = document.getElementById("shootButton");

// Set initial player position
player.style.left = `${playerPosition}px`;

// Cooldown timer
let lastFireTime = 0; // Time when the player last fired
const fireCooldown = 2800; // Updated cooldown: 2800ms

// Player Movement
function movePlayer(direction) {
    const step = 10;
    if (direction === "left" && playerPosition > 0) {
        playerPosition -= step;
    } else if (direction === "right" && playerPosition < gameArea.offsetWidth - player.offsetWidth) {
        playerPosition += step;
    }
    player.style.left = `${playerPosition}px`;
}

// Shooting Bullets
function shootBullet() {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left = `${playerPosition + player.offsetWidth / 2 - 2.5}px`;
    bullet.style.bottom = "30px";
    gameArea.appendChild(bullet);
    bullets.push(bullet);
}

// Add Event Listeners for Buttons
leftButton.addEventListener("click", () => movePlayer("left"));
rightButton.addEventListener("click", () => movePlayer("right"));
shootButton.addEventListener("click", () => {
    if (canFire()) {
        shootBullet();
    }
});

// Cooldown Checker
function canFire() {
    const currentTime = Date.now(); // Get the current time in milliseconds
    if (currentTime - lastFireTime >= fireCooldown) {
        lastFireTime = currentTime; // Update the last fire time
        return true;
    }
    return false;
}

// Create Invaders
function createInvaders() {
    const rows = 3; // Number of rows
    const columns = 6; // Number of invaders per row
    const horizontalSpacing = 80; // Space between invaders horizontally
    const verticalSpacing = 40; // Space between rows

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const invader = document.createElement("div");
            invader.classList.add("invader");

            // Set initial position of the invader
            const x = col * horizontalSpacing + 20; // 20px margin on the left
            const y = row * verticalSpacing + 10; // 10px margin on the top
            invader.style.left = `${x}px`;
            invader.style.top = `${y}px`;

            gameArea.appendChild(invader);
            invaders.push({ element: invader, x: x, y: y, direction: 1 });
        }
    }
}

// Move Invaders
function moveInvaders() {
    invaders.forEach((invader) => {
        invader.x += invaderSpeed * invader.direction;
        if (invader.x <= 0 || invader.x >= gameArea.offsetWidth - 30) {
            invader.direction *= -1;
            invader.y += 20;
        }
        invader.element.style.left = `${invader.x}px`;
        invader.element.style.top = `${invader.y}px`;

        // Randomly shoot bullets
        if (Math.random() < 0.01) {
            shootInvaderBullet(invader.x, invader.y);
        }
    });
}

// Shoot Invader Bullet
function shootInvaderBullet(x, y) {
    const bullet = document.createElement("div");
    bullet.classList.add("invader-bullet");
    bullet.style.left = `${x + 12.5}px`;
    bullet.style.top = `${y + 20}px`;
    gameArea.appendChild(bullet);
    invaderBullets.push(bullet);
}

// Move Invader Bullets
function moveInvaderBullets() {
    invaderBullets = invaderBullets.filter((bullet) => {
        const currentTop = parseInt(bullet.style.top);
        if (currentTop >= gameArea.offsetHeight) {
            bullet.remove();
            return false;
        } else {
            bullet.style.top = `${currentTop + 5}px`;

            // Check collision with player
            const bulletRect = bullet.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();

            if (
                bulletRect.left < playerRect.right &&
                bulletRect.right > playerRect.left &&
                bulletRect.top < playerRect.bottom &&
                bulletRect.bottom > playerRect.top
            ) {
                bullet.remove();
                playerHit();
                return false;
            }

            return true;
        }
    });
}

// Handle Player Hit
function playerHit() {
    playerLives--;
    if (playerLives === 0) {
        endGame();
    }
}

// End Game
function endGame() {
    clearInterval(gameInterval);
    const loseMessage = document.createElement("div");
    loseMessage.innerHTML = `
        <h2 style="color: red; text-align: center; font-size: 2rem;">Game Over! You Lost.</h2>
    `;
    gameArea.appendChild(loseMessage);
}

// Move Bullets
function moveBullets() {
    bullets = bullets.filter((bullet) => {
        const currentBottom = parseInt(bullet.style.bottom);
        if (currentBottom >= gameArea.offsetHeight) {
            bullet.remove();
            return false;
        } else {
            bullet.style.bottom = `${currentBottom + 5}px`;
            return true;
        }
    });
}

// Check for Collisions
function checkCollisions() {
    bullets.forEach((bullet) => {
        const bulletRect = bullet.getBoundingClientRect();
        invaders = invaders.filter((invader) => {
            const invaderRect = invader.element.getBoundingClientRect();
            if (
                bulletRect.left < invaderRect.right &&
                bulletRect.right > invaderRect.left &&
                bulletRect.top < invaderRect.bottom &&
                bulletRect.bottom > invaderRect.top
            ) {
                bullet.remove();
                invader.element.remove();
                return false;
            }
            return true;
        });
    });

    // Check if all invaders are destroyed
    if (invaders.length === 0) {
        winGame();
    }
}

// Display "You Won" and Link to Next Page
function winGame() {
    clearInterval(gameInterval);
    const winMessage = document.createElement("div");
    winMessage.innerHTML = `
        <h2 style="color: yellow; text-align: center; font-size: 2rem;">🎉 You Won! 🎉</h2>
        <a href="puzzle3.html" style="display: block; text-align: center; color: white; font-size: 1.5rem; margin-top: 20px;">Proceed to the Next Challenge</a>
    `;
    gameArea.appendChild(winMessage);
}

// Game Loop
function gameLoop() {
    moveInvaders();
    moveBullets();
    moveInvaderBullets();
    checkCollisions();
}

// Start Game
function startGame() {
    createInvaders();
    gameInterval = setInterval(gameLoop, 50);
}

startGame();
