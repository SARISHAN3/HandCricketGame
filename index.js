// array setup for hand emojis, player names, and scores
let HAND_EMOJIS = ["✊", "☝️", "✌️", "👌", "🖖", "🖐️", "👍"],
  PLAYER_NAMES = ["Player 1", "Player 2", "Player 3"],
  scores = [0, 0, 0];

// currentplayer checker
let currentPlayer = 0;

// screens setups
let welcomeScreen = document.getElementById("welcome-screen"),
  nameScreen = document.getElementById("name-screen"),
  gameScreen = document.getElementById("game-screen");

// score show setup
let pHand = document.getElementById("player-hand"),
  cHand = document.getElementById("com-hand");

// moves result message setup
let resultMsg = document.getElementById("result-msg");

// game active checker
let gameActive = true;

// welcome screen showing by default
function showWelcome() {
  welcomeScreen.style.display = "flex";
  nameScreen.style.display = "none";
  gameScreen.style.display = "none";

  document.body.style.alignItems = "center";

  // Hide game-over panel (visible if this is a replay)
  document.getElementById("game-over").style.display = "none";
}

// name screen showing
function showNameScreen() {
  welcomeScreen.style.display = "none";
  nameScreen.style.display = "flex";
  gameScreen.style.display = "none";

  document.body.style.alignItems = "center";
}

// game screen showing
function showGameScreen() {
  welcomeScreen.style.display = "none";
  nameScreen.style.display = "none";
  gameScreen.style.display = "block";

  document.body.style.alignItems = "flex-start";
}

// start game with default player names
function startGame() {
  PLAYER_NAMES = ["Player 1", "Player 2", "Player 3"];
  resetGame();
}

// start game with custom player names from the name screen
function startWithNames() {
  let n1 = document.getElementById("name1").value.trim();
  let n2 = document.getElementById("name2").value.trim();
  let n3 = document.getElementById("name3").value.trim();

  PLAYER_NAMES = [n1 || "Player 1", n2 || "Player 2", n3 || "Player 3"];

  resetGame();
}

function resetGame() {
  // Reset all game variables to their starting values
  scores = [0, 0, 0];
  currentPlayer = 0;
  gameActive = true;

  // Reset player name labels and scores on the scoreboard, and set first player as active
  for (let s = 0; s < 3; s++) {
    document.getElementById(`score${s}-label`).textContent = PLAYER_NAMES[s];
    document.getElementById(`score${s}-val`).textContent = 0;
    document.getElementById(`score${s}`).classList.toggle("active", s === 0);
  }

  // Reset team total to 0
  document.getElementById("score-team-val").textContent = 0;

  // Reset both hands to faded ✊
  pHand.textContent = "✊";
  cHand.textContent = "✊";
  //   Add .pending class to fade the hands (CSS will handle the opacity)
  pHand.classList.add("pending");
  cHand.classList.add("pending");

  // Reset result message text and remove .out or .runs color classes
  resultMsg.textContent = "Choose your move";
  resultMsg.className = "result-msg";

  // showing current batting player and hilighting name
  document.getElementById("status-bar").innerHTML =
    `<span class="player-tag">${PLAYER_NAMES[0]}</span> is batting`;

  // Hide game-over panel (visible if this is a replay)
  document.getElementById("game-over").style.display = "none";

  showGameScreen();
}

function computeRand() {
  let r = Math.floor(Math.random() * 11);

  if (r === 0) return 0;
  if (r === 1) return 1;
  if (r === 2) return 2;
  if (r === 3) return 3;
  if (r <= 5) return 4;
  if (r <= 7) return 5;
  return 6;
}

function updateScoreboard() {
  for (let s = 0; s < 3; s++) {
    document.getElementById(`score${s}-val`).textContent = scores[s];

    document
      .getElementById(`score${s}`)
      .classList.toggle("active", s === currentPlayer && gameActive);
  }

  document.getElementById("score-team-val").textContent =
    scores[0] + scores[1] + scores[2];
}

function game(p) {
  if (!gameActive) return;

  let com = computeRand();

  // Every ball massage setup
  let msgMove = resultMsg;

  // Show the hands played by both player and computer
  pHand.textContent = HAND_EMOJIS[p];
  cHand.textContent = HAND_EMOJIS[com];
  // Remove .pending class to make the
  pHand.classList.remove("pending");
  cHand.classList.remove("pending");

  if (p === com) {
    // ── PLAYER IS OUT ──
    // Both chose the same number
    msgMove.textContent = `${PLAYER_NAMES[currentPlayer]} is OUT!`;
    msgMove.className = "result-msg out"; // CSS turns this red

    currentPlayer++; // move to the next player

    if (currentPlayer >= 3) {
      // All 3 players are out — the game over screen will show the final scores and team total
      endGame();
      return;
    }

    // Still players left — update board and status for the next player
    updateScoreboard();
    document.getElementById("status-bar").innerHTML =
      `<span class="player-tag">${PLAYER_NAMES[currentPlayer]}</span> is batting`;
  } else {
    // ── RUNS SCORED ──

    // Add the runs to the current player's total
    scores[currentPlayer] += p;

    if (p === 0) {
      msgMove.textContent = "Dot ball — no run";
      msgMove.className = "result-msg"; // neutral grey text
    } else if (p === 6) {
      // Six scored — show with the emoji and a special message
      msgMove.textContent = `${HAND_EMOJIS[p]} SIX! Amazing shot!`;
      msgMove.className = "result-msg six"; // CSS turns this bright orange
    } else if (p === 4 || p === 5) {
      // Boundary runs — show with the emoji
      msgMove.textContent = `${HAND_EMOJIS[p]} Boundary!`;
      msgMove.className = "result-msg boundary"; // CSS turns this bright green
    } else {
      // Normal run — show how many with the emoji
      msgMove.textContent = `${HAND_EMOJIS[p]} Scored ${p} run${p > 1 ? "s" : ""}!`;
      msgMove.className = "result-msg runs"; // CSS turns this white
    }

    updateScoreboard();
  }
}

function endGame() {
  // Stop the game — future button clicks will be ignored
  gameActive = false;

  document.getElementById("status-bar").innerHTML =
    "Innings over — all players out";

  // Add all 3 scores for the team total
  const total = scores[0] + scores[1] + scores[2];

  // Set the game-over headline
  document.getElementById("go-title").textContent =
    `🏏 Final Score: ${total} Runs`;

  // Build the scorecard with real player names
  // innerHTML lets us write HTML tags inside (for <strong> and <br>)
  document.getElementById("go-total").innerHTML =
    `${PLAYER_NAMES[0]}: <strong>${scores[0]}</strong> runs &nbsp;·&nbsp;
     ${PLAYER_NAMES[1]}: <strong>${scores[1]}</strong> runs &nbsp;·&nbsp;
     ${PLAYER_NAMES[2]}: <strong>${scores[2]}</strong> runs<br>`;

  // Reveal the game-over panel (was display:none before)
  document.getElementById("game-over").style.display = "block";

  // hide other sections
  welcomeScreen.style.display = "none";
  nameScreen.style.display = "none";
  gameScreen.style.display = "none";

  // Refresh scoreboard — gameActive is now false, so no card will be highlighted
  updateScoreboard();
}

function resetGameNow() {
  resetGame();
}
