// script.js - Word Guessing Game
(() => {
  const words = [
    { word: "PYTHON", hint: "Popular programming language" },
    { word: "JAVASCRIPT", hint: "Language for the web" },
    { word: "MANGO", hint: "A tropical fruit" },
    { word: "COMPUTER", hint: "Electronic machine" },
    { word: "GUITAR", hint: "String musical instrument" }
  ];

  const maxAttempts = 6;
  let chosen = null;
  let attemptsLeft = maxAttempts;
  let guessedSet = new Set();
  let correctSet = new Set();

  // DOM
  const wordArea = document.getElementById("wordArea");
  const keyboard = document.getElementById("keyboard");
  const attemptsEl = document.getElementById("attempts");
  const hintText = document.getElementById("hintText");
  const messageEl = document.getElementById("message");
  const newGameBtn = document.getElementById("newGameBtn");
  const showAnswerBtn = document.getElementById("showAnswerBtn");

  function pickRandom() {
    return words[Math.floor(Math.random()*words.length)];
  }

  function renderWord() {
    wordArea.innerHTML = "";
    for (let i = 0; i < chosen.word.length; i++) {
      const ch = chosen.word[i];
      const box = document.createElement("div");
      box.className = "letter-box";
      box.setAttribute("data-index", i);
      box.textContent = correctSet.has(ch) ? ch : "";
      wordArea.appendChild(box);
    }
  }

  function createKeyboard() {
    keyboard.innerHTML = "";
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (const l of letters) {
      const btn = document.createElement("button");
      btn.className = "key";
      btn.textContent = l;
      btn.dataset.letter = l;
      btn.addEventListener("click", () => handleGuess(l));
      keyboard.appendChild(btn);
    }
  }

  function updateAttempts() {
    attemptsEl.textContent = attemptsLeft;
  }

  function setMessage(msg, type="") {
    messageEl.textContent = msg;
    messageEl.style.color = type === "error" ? "var(--bad)" : type === "success" ? "var(--ok)" : "var(--muted)";
  }

  function disableKey(letter, className) {
    const btn = keyboard.querySelector(`button[data-letter="${letter}"]`);
    if (btn) {
      btn.classList.add("disabled", className);
      btn.disabled = true;
    }
  }

  function handleGuess(letter) {
    if (attemptsLeft <= 0) return;
    if (guessedSet.has(letter)) {
      setMessage("You already guessed '" + letter + "'.", "error");
      return;
    }
    guessedSet.add(letter);

    if (chosen.word.includes(letter)) {
      // correct
      correctSet.add(letter);
      setMessage("Nice! '" + letter + "' is correct.", "success");
      disableKey(letter, "correct");
    } else {
      attemptsLeft--;
      updateAttempts();
      setMessage("Oops! '" + letter + "' is not in the word.", "error");
      disableKey(letter, "wrong");
    }
    renderWord();
    checkGameState();
  }

  function checkGameState() {
    // Win if all unique letters covered
    const uniqueLetters = new Set(chosen.word.split(""));
    let won = true;
    for (const l of uniqueLetters) {
      if (!correctSet.has(l)) { won = false; break; }
    }
    if (won) {
      setMessage("🎉 You won! The word was " + chosen.word, "success");
      endGame();
    } else if (attemptsLeft <= 0) {
      setMessage("💀 You lost! The word was " + chosen.word, "error");
      revealAnswer();
      endGame();
    }
  }

  function endGame() {
    // disable all keys
    keyboard.querySelectorAll("button.key").forEach(b => b.disabled = true);
  }

  function revealAnswer() {
    correctSet = new Set(chosen.word.split(""));
    renderWord();
  }

  function newGame() {
    chosen = pickRandom();
    attemptsLeft = maxAttempts;
    guessedSet.clear();
    correctSet.clear();
    updateAttempts();
    hintText.textContent = chosen.hint;
    setMessage("Start guessing letters!", "");
    renderWord();
    createKeyboard();
  }

  // keyboard typing support
  window.addEventListener("keydown", (e) => {
    const k = e.key.toUpperCase();
    if (/^[A-Z]$/.test(k)) {
      const btn = keyboard.querySelector(`button[data-letter="${k}"]`);
      if (btn && !btn.disabled) handleGuess(k);
    }
  });

  // Buttons
  newGameBtn.addEventListener("click", newGame);
  showAnswerBtn.addEventListener("click", () => {
    revealAnswer();
    setMessage("Answer revealed: " + chosen.word, "error");
    endGame();
  });

  // Initialize
  newGame();
})();
