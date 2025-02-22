window.onload = function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const startScreen = document.getElementById('startScreen');
  const pauseScreen = document.getElementById('pauseScreen');
  const gameOverScreen = document.getElementById('gameOverScreen');
  const bgMusic = document.getElementById('bgMusic');
  const shootSound = document.getElementById('shootSound');

  let gameStarted = false;
  let paused = false;
  let lastTime = 0;

  // Define players with shooting keys: Player 1 uses 'f', Player 2 uses 'l'
  const players = [
    { id: 1, x: 100, y: canvas.height - 50, width: 40, height: 40, shootKey: 'f', bullets: [] },
    { id: 2, x: canvas.width - 140, y: canvas.height - 50, width: 40, height: 40, shootKey: 'l', bullets: [] }
  ];

  // Listen for keydown events for shooting and pausing
  document.addEventListener('keydown', function(e) {
    if (!gameStarted) return; // Only process when game is running

    // Toggle pause if 'p' is pressed
    if(e.key.toLowerCase() === 'p') {
      togglePause();
    }

    // Check for shooting keys for each player
    players.forEach(player => {
      if(e.key.toLowerCase() === player.shootKey) {
        shoot(player);
      }
    });
  });

  // Shoot function: creates a bullet and plays shooting sound
  function shoot(player) {
    const bullet = {
      x: player.x + player.width / 2,
      y: player.y,
      radius: 5,
      speed: 5,
      direction: player.id === 1 ? 1 : -1  // Player 1 shoots right, Player 2 shoots left
    };
    player.bullets.push(bullet);
    shootSound.currentTime = 0;
    shootSound.play();
  }

  // Update game objects
  function update(deltaTime) {
    players.forEach(player => {
      player.bullets.forEach((bullet, index) => {
        bullet.x += bullet.speed * bullet.direction;
        // Remove bullet if off screen
        if(bullet.x < 0 || bullet.x > canvas.width) {
          player.bullets.splice(index, 1);
        }
      });
    });
  }

  // Draw game objects
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw players
    players.forEach(player => {
      ctx.fillStyle = player.id === 1 ? 'blue' : 'red';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      // Draw bullets
      player.bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
      });
    });
  }

  // Main game loop using requestAnimationFrame
  function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    if (!paused) {
      update(deltaTime);
      draw();
    }
    requestAnimationFrame(gameLoop);
  }

  // Start game: hide start screen, animate canvas drop, and start the loop
  window.startGame = function() {
    startScreen.classList.add('hidden');
    // Trigger drop down animation
    canvas.classList.add('drop-animation');
    gameStarted = true;
    bgMusic.currentTime = 0;
    bgMusic.play();
    requestAnimationFrame(gameLoop);
  };

  // Toggle pause: show/hide pause overlay and pause/resume background music
  window.togglePause = function() {
    if (!gameStarted) return;
    paused = !paused;
    if (paused) {
      pauseScreen.classList.remove('hidden');
      bgMusic.pause();
    } else {
      pauseScreen.classList.add('hidden');
      bgMusic.play();
    }
  };

  // Restart game: reset game state and overlays
  window.restartGame = function() {
    paused = false;
    gameStarted = false;
    players.forEach(player => {
      player.bullets = [];
    });
    pauseScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    canvas.classList.remove('drop-animation');
    // Reset player positions if needed
    players[0].x = 100;
    players[0].y = canvas.height - 50;
    players[1].x = canvas.width - 140;
    players[1].y = canvas.height - 50;
    bgMusic.pause();
    bgMusic.currentTime = 0;
  };

  // Play again: restart game and start immediately
  window.playAgain = function() {
    restartGame();
    startGame();
  };

  // Optional: Full screen toggle function
  window.toggleFullScreen = function() {
    if (!document.fullscreenElement) {
      canvas.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
};
