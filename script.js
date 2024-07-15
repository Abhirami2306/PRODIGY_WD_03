document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const cells = document.querySelectorAll(".cell");
  const message = document.getElementById("message");
  const resetButton = document.getElementById("reset");
  const gameModeSelect = document.getElementById("gameMode");
  const playerXInput = document.getElementById("playerX");
  const playerOInput = document.getElementById("playerO");
  let currentPlayer = "X";
  let gameState = Array(9).fill(null);
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  cells.forEach((cell) => {
    cell.addEventListener("click", handleClick);
  });

  resetButton.addEventListener("click", resetGame);

  function handleClick(event) {
    const cell = event.target;
    const index = cell.getAttribute("data-index");

    if (gameState[index] || checkWinner()) {
      return;
    }

    makeMove(index, currentPlayer);

    if (checkWinner()) {
      message.textContent = `${getPlayerName(currentPlayer)} wins!`;
    } else if (gameState.every((cell) => cell)) {
      message.textContent = "It's a tie!";
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      if (gameModeSelect.value.startsWith("ai") && currentPlayer === "O") {
        makeAiMove();
      }
    }
  }

  function makeMove(index, player) {
    gameState[index] = player;
    cells[index].textContent = player;
  }

  function checkWinner() {
    return winningCombinations.some((combination) => {
      return combination.every((index) => {
        return gameState[index] === currentPlayer;
      });
    });
  }

  function makeAiMove() {
    let aiMove;
    switch (gameModeSelect.value) {
      case "ai-easy":
        aiMove = getRandomMove();
        break;
      case "ai-medium":
        aiMove = getMediumMove();
        break;
      case "ai-hard":
        aiMove = getBestMove();
        break;
    }
    makeMove(aiMove, "O");
    if (checkWinner()) {
      message.textContent = `${getPlayerName("O")} wins!`;
    } else if (gameState.every((cell) => cell)) {
      message.textContent = "It's a tie!";
    } else {
      currentPlayer = "X";
    }
  }

  function getRandomMove() {
    let emptyCells = [];
    gameState.forEach((cell, index) => {
      if (!cell) emptyCells.push(index);
    });
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  function getMediumMove() {
    let emptyCells = [];
    gameState.forEach((cell, index) => {
      if (!cell) emptyCells.push(index);
    });

    // Check if AI can win
    for (let combination of winningCombinations) {
      let [a, b, c] = combination;
      if (gameState[a] === "O" && gameState[b] === "O" && !gameState[c])
        return c;
      if (gameState[a] === "O" && gameState[c] === "O" && !gameState[b])
        return b;
      if (gameState[b] === "O" && gameState[c] === "O" && !gameState[a])
        return a;
    }

    // Check if player can win and block
    for (let combination of winningCombinations) {
      let [a, b, c] = combination;
      if (gameState[a] === "X" && gameState[b] === "X" && !gameState[c])
        return c;
      if (gameState[a] === "X" && gameState[c] === "X" && !gameState[b])
        return b;
      if (gameState[b] === "X" && gameState[c] === "X" && !gameState[a])
        return a;
    }

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  function getBestMove() {
    return minimax(gameState, "O").index;
  }

  function minimax(newBoard, player) {
    let availSpots = newBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    if (checkWinnerForMinimax(newBoard, "X")) {
      return { score: -10 };
    } else if (checkWinnerForMinimax(newBoard, "O")) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
      let move = {};
      move.index = availSpots[i];
      newBoard[move.index] = player;

      if (player === "O") {
        let result = minimax(newBoard, "X");
        move.score = result.score;
      } else {
        let result = minimax(newBoard, "O");
        move.score = result.score;
      }

      newBoard[move.index] = null;
      moves.push(move);
    }

    let bestMove;
    if (player === "O") {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  function checkWinnerForMinimax(board, player) {
    return winningCombinations.some((combination) => {
      return combination.every((index) => {
        return board[index] === player;
      });
    });
  }

  function resetGame() {
    gameState = Array(9).fill(null);
    cells.forEach((cell) => {
      cell.textContent = "";
    });
    currentPlayer = "X";
    message.textContent = "";
  }

  function getPlayerName(player) {
    if (player === "X") {
      return playerXInput.value || "Player 1";
    } else {
      return playerOInput.value || "Player 2";
    }
  }
});
