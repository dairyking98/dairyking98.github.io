// Thanksgiving 2025 Challenge Game
const categories = {
  movement: [
    "crab-walking",
    "tiptoeing",
    "moonwalking",
    "hopping on one foot",
    "crawling backwards",
    "skipping",
    "shuffling sideways",
    "marching",
    "waddling",
    "prancing",
    "stomping",
    "gliding",
    "bouncing",
    "twirling",
    "slithering",

    // medium
    "speed-walking like you're pissed off",
    "stomping like you mean it",
    "prancing with zero shame",
    "tiptoeing like you broke something",
    "lunging with unnecessary aggression",

    // chaotic / curse-lite
    "moonwalking like a disaster",
    "staggering like a hot mess",
    "storming around like you're done with everyone’s shit",
    "side-stepping like you're dodging idiots",
    "power-walking like hell is behind you",
  ],

  animal: [
    "a penguin",
    "a crab",
    "a flamingo",
    "a sloth",
    "a peacock",
    "a gorilla",
    "a chicken",
    "a snake",
    "a bear",
    "a monkey",
    "a cat",
    "a dog",
    "a duck",
    "a turkey",
    "a kangaroo",
    "a seal",
    "a frog",
    "a spider",

    // medium
    "a feral raccoon",
    "a pissed-off goose",
    "a judgmental cat",
    "a chaotic squirrel",
    "a shady-looking turtle",

    // R-lite / chaotic
    "a gremlin-ass lemur",
    "a disaster flamingo",
    "a raccoon with beef",
    "a buffalo who’s had a rough week",
    "a squirrel on edge",
  ],

  mannerism: [
    // Mild
    "with dramatic sighs",
    "with suspicious glances",
    "with nervous muttering",
    "with loud humming",
    "with finger snaps",
    "with nonstop winking",
    "with constant throat-clearing",
    "with imaginary glasses adjustments",
    "with casual shoulder shrugs",
    "with rolling eyes",
    "with chaotic jazz hands",
  
    // Medium
    "with unhinged giggling",
    "with sarcastic finger guns",
    "with sharp pointing gestures",
    "with restless pacing steps",
    "with frantic face wiping",
    "with exaggerated blinking",
    "with fussy shirt tugging",
    "with dramatic hand flailing",
    "with intense nose-scrunching",
  
    // Chaotic / R-lite
    "with feral hand gestures",
    "with zero-patience eyebrow raises",
    "with 'don’t push me' eye contact",
    "with petty side-eyes",
    "with chaotic mumbling",
    "with aggressive head shaking",
    "with exaggerated lip pursing",
    "with tense jaw clenching",
    "with wild double-takes"
  ],
  

  mundaneAction: [
    // Mild / basic physical actions
    "brushing your teeth",
    "tying your shoes",
    "buttoning your shirt",
    "zipping a jacket",
    "sweeping the floor",
    "mopping a spill",
    "folding a towel",
    "scrubbing a pan",
    "wiping a counter",
    "drying your hands",
    "shaking out a rug",
    "watering a plant",
    "stirring a pot",
    "opening a jar",
    "peeling a sticker off something",
    "carrying a heavy box",
    "stacking items neatly",
    "opening a backpack",
    "checking your pockets",
    "patting your pockets for something lost",
    "picking something up",
    "reaching for a high shelf",
    "lifting a chair",
    "dusting a shelf",

    // Medium energy / chaotic actions
    "fighting with a stuck zipper",
    "untangling cords aggressively",
    "slamming a drawer shut",
    "shaking a vending machine",
    "smacking a remote that won’t work",
    "fumbling for keys in a panic",
    "arguing with a jammed door",
    "trying to close an overstuffed bag",
    "trying to fold a fitted sheet",
    "dropping something and panicking",
    "shooing something imaginary away",
    "chasing after a rolling item",
    "ripping open a stubborn package",
    "tapping a jammed touchscreen",

    // R-lite / full adult-party energy
    "rage-cleaning a counter",
    "slamming a cupboard in frustration",
    "shaking a bottle angrily",
    "flicking something off your clothes like it offended you",
    "trying to drink from an empty cup",
    "stomping while picking up a mess",
    "cursing at tangled earbuds",
    "fighting with a trash bag",
    "opening a door like it owes you money",
    "grabbing something off the floor with zero dignity",
  ],

  everydaySituation: [
    "using a vending machine",
    "lifting heavy groceries",
    "hailing a taxi",
    "running for a bus",
    "waiting for a bus stop",
    "shopping for produce",
    "checking items on a shelf",
    "pushing a shopping cart",
    "digging through a backpack",
    "opening a stuck door",
    "walking a dog that’s pulling you",
    "jogging in place",
    "scrubbing a counter",
    "sawing a piece of wood",
    "raking leaves",
    "shoveling snow",
    "hammering a nail",
    "sweeping the floor",
    "carrying a heavy box",
    "looking for your car",
    "looking under furniture",
    "waiting in a long line",
    "trying to reach a high shelf",
    "trying a stuck zipper",
    "wrapping a gift",
    "lugging a suitcase",
    "mopping a spill",
    "searching pockets for change",
    "fumbling with a stubborn umbrella",
    "using a leaf blower",
    "unclogging a vacuum",
    "waving someone closer",
    "checking something behind you",
    "wiping fog off a mirror",
    "pushing a jammed door",
    "balancing something on your head",
    "shielding your eyes from the sun",
    "tightening a loose screw",
    "dragging something heavy",
  ],

  modifier: [
    "completely sober and irritated",
    "tipsy and overly friendly",
    "drunk but pretending you're fine",
    "high on life and bad choices",
    "crossfaded and confused",
    "jittery like you chugged coffee",
    "medicated and spaced out",
    "sleep-deprived and feral",
    "starving and dramatic",
    "caffeinated beyond reason",

    // R-lite additions
    "done with everyone's shit",
    "emotionally unstable but polite",
    "like it's been a hell of a week",
    "like you can't deal with this crap",
    "one inconvenience from snapping",
  ],
};

const categoryLabels = {
  movement: "Movement type",
  animal: "Animal / creature",
  mannerism: "Mannerism",
  mundaneAction: "Mundane human action",
  everydaySituation: "Everyday action / situation",
  modifier: "Modifier",
};

const contestants = ["Kathy", "Grace", "Michi", "Maia", "Todd", "Alyssa", "Bagheera", "Louie"];

let scores = [];
let usedContestants = [];
let currentContestant = null;

// Load data from localStorage
function loadData() {
  const savedScores = localStorage.getItem("thanksgiving2025_scores");
  if (savedScores) {
    scores = JSON.parse(savedScores);
    updateScoreboard();
  }

  const savedUsed = localStorage.getItem("thanksgiving2025_used");
  if (savedUsed) {
    usedContestants = JSON.parse(savedUsed);
    updateContestantsList();
  }
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("thanksgiving2025_scores", JSON.stringify(scores));
  localStorage.setItem("thanksgiving2025_used", JSON.stringify(usedContestants));
}

// Update contestants list display
function updateContestantsList() {
  const contestantsList = document.getElementById("contestantsList");
  if (!contestantsList) return;

  const available = contestants.filter((name) => !usedContestants.includes(name));
  const used = usedContestants;

  let html = "";
  if (available.length > 0) {
    html += `<div class="available-contestants"><strong>Available:</strong> ${available.join(", ")}</div>`;
  }
  if (used.length > 0) {
    html += `<div class="used-contestants"><strong>Completed:</strong> <span class="checked-off">${used.join(", ")}</span></div>`;
  }
  if (available.length === 0 && used.length > 0) {
    html += `<div class="all-done">🎉 All contestants have completed their challenges!</div>`;
  }

  contestantsList.innerHTML = html;
}

// Spin for a random contestant name
function spinForName() {
  const available = contestants.filter((name) => !usedContestants.includes(name));

  if (available.length === 0) {
    alert("All contestants have already been selected! Reset to start over.");
    return;
  }

  // Randomly select a contestant
  const randomIndex = Math.floor(Math.random() * available.length);
  currentContestant = available[randomIndex];

  // Display the selected name
  const selectedNameEl = document.getElementById("selectedName");
  if (selectedNameEl) {
    selectedNameEl.textContent = currentContestant;
    selectedNameEl.parentElement.classList.add("show");
  }

  // Mark as used
  usedContestants.push(currentContestant);
  updateContestantsList();
  saveData();

  // Enable the challenge spin button
  const challengeButton = document.getElementById("spinChallengeButton");
  if (challengeButton) {
    challengeButton.disabled = false;
    challengeButton.textContent = "🎲 Spin Challenge 🎲";
  }

  // Update scoring section
  updateScoringSection();
}

// Update scoring section when challenge is generated
function updateScoringAfterChallenge() {
  updateScoringSection();
}

// Generate a random challenge for the current contestant
function generateChallenge() {
  if (!currentContestant) {
    alert("Please spin for a name first!");
    return;
  }

  const selectedCategories = [];
  const selectedItems = [];

  // Helper function to randomly select from a category
  const selectFromCategory = (categoryName) => {
    const items = categories[categoryName];
    const randomItem = items[Math.floor(Math.random() * items.length)];
    selectedCategories.push(categoryName);
    selectedItems.push(randomItem);
    return randomItem;
  };

  // Decide what kind of thing is the PRIMARY action/anchor
  // Weights: animal (35%), everyday (30%), mundane (20%), pure movement (15%)
  const roll = Math.random();
  let primaryCategory;
  if (roll < 0.35) {
    primaryCategory = "animal";
  } else if (roll < 0.65) {
    primaryCategory = "everydaySituation";
  } else if (roll < 0.85) {
    primaryCategory = "mundaneAction";
  } else {
    primaryCategory = "movement";
  }

  const primaryItem = selectFromCategory(primaryCategory);

  // OPTIONAL secondary physical action:
  // Only allowed if primary is an animal (so you can "be a raccoon" doing something)
  let secondaryCategory = null;
  let secondaryItem = null;

  if (primaryCategory === "animal" && Math.random() < 0.7) {
    // 70% chance to add one extra action
    secondaryCategory = Math.random() < 0.5 ? "movement" : "mundaneAction";
    secondaryItem = selectFromCategory(secondaryCategory);
  }

  // Mannerism (always included)
  const mannerismItem = selectFromCategory("mannerism");

  // Modifier (optional, ~60% chance)
  const includeModifier = Math.random() < 0.6;
  const modifierItem = includeModifier ? selectFromCategory("modifier") : null;

  // ---------- Build the sentence (one main action, no conflicting doubles) ----------

  let basePart = "";

  if (primaryCategory === "animal") {
    // "Act like a raccoon speed-walking"
    basePart = primaryItem;
    if (secondaryItem) {
      basePart += " " + secondaryItem;
    }
  } else {
    // "Act like you're sawing wood" / "Act like you're sweeping the floor"
    basePart = "you're " + primaryItem;
  }

  const extraParts = [];

  // Convert "while ..." in mannerism to "with ..."
  // e.g. "while dramatically sighing" -> "with dramatically sighing"
  let displayMannerism = mannerismItem.trim();
  if (displayMannerism.toLowerCase().startsWith("while ")) {
    displayMannerism = "with " + displayMannerism.slice(6);
  }
  extraParts.push(displayMannerism);

  // Modifier comes last
  if (modifierItem) {
    extraParts.push(modifierItem);
  }

  let sentence = "Act like " + basePart;
  if (extraParts.length > 0) {
    sentence += " " + extraParts.join(" ");
  }
  sentence += ".";

  // Display the result
  const sentenceWithName = `${currentContestant}: ${sentence}`;
  document.getElementById("combinedSentence").textContent = sentenceWithName;

  // Display breakdown
  const breakdownList = document.getElementById("breakdownList");
  breakdownList.innerHTML = "";

  selectedCategories.forEach((category, index) => {
    const div = document.createElement("div");
    div.className = "category-item";
    div.innerHTML = `<span class="category-label">${categoryLabels[category]}:</span> ${selectedItems[index]}`;
    breakdownList.appendChild(div);
  });

  // Show result and handle visibility state
  document.getElementById("challengeResult").classList.add("show");

  const challengeContent = document.getElementById("challengeContent");
  const toggleButton = document.getElementById("toggleChallengeButton");

  if (challengeContent && toggleButton) {
    const wasVisible =
      challengeContent.classList.contains("visible") || (challengeContent.style.display !== "none" && challengeContent.style.display !== "");

    if (wasVisible) {
      challengeContent.style.display = "block";
      challengeContent.classList.remove("hidden");
      challengeContent.classList.add("visible");
      toggleButton.textContent = "🙈 Hide Challenge";
    } else {
      challengeContent.style.display = "none";
      challengeContent.classList.remove("visible");
      challengeContent.classList.add("hidden");
      toggleButton.textContent = "👁️ Show Challenge";
    }
  }

  updateScoringSection();
}

// Toggle challenge visibility
function toggleChallengeVisibility() {
  const challengeContent = document.getElementById("challengeContent");
  const toggleButton = document.getElementById("toggleChallengeButton");

  if (!challengeContent || !toggleButton) return;

  const isHidden = challengeContent.style.display === "none" || challengeContent.classList.contains("hidden");

  if (isHidden) {
    challengeContent.style.display = "block";
    challengeContent.classList.remove("hidden");
    challengeContent.classList.add("visible");
    toggleButton.textContent = "🙈 Hide Challenge";
  } else {
    challengeContent.style.display = "none";
    challengeContent.classList.remove("visible");
    challengeContent.classList.add("hidden");
    toggleButton.textContent = "👁️ Show Challenge";
  }
}

// Countdown timer state
let countdownInterval = null;
let countdownSeconds = 0;

// Play sound using Web Audio API
function playCountdownSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Create a beep sound
  oscillator.frequency.value = 800;
  oscillator.type = "sine";
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

// Start the act countdown
function startActCountdown() {
  const actButton = document.getElementById("actButton");
  const countdownDisplay = document.getElementById("countdownDisplay");

  if (!actButton || !countdownDisplay) return;

  // Reset if already running
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  // Disable button during countdown
  actButton.disabled = true;
  countdownSeconds = 10;

  // Show countdown display
  countdownDisplay.style.display = "block";
  countdownDisplay.textContent = countdownSeconds;

  // Start countdown
  countdownInterval = setInterval(() => {
    countdownSeconds--;

    if (countdownSeconds > 0) {
      countdownDisplay.textContent = countdownSeconds;
    } else {
      // Countdown finished
      clearInterval(countdownInterval);
      countdownInterval = null;

      // Play sound
      playCountdownSound();

      // Show "TIME'S UP!" message
      countdownDisplay.textContent = "TIME'S UP!";
      countdownDisplay.style.color = "#dc3545";

      // Reset after 2 seconds
      setTimeout(() => {
        countdownDisplay.style.display = "none";
        countdownDisplay.style.color = "#d2691e";
        actButton.disabled = false;
        countdownSeconds = 0;
      }, 2000);
    }
  }, 1000);
}

// Update scoring section with current contestant
function updateScoringSection() {
  const scoringSection = document.getElementById("scoringSection");
  const scoringPlayerName = document.getElementById("scoringPlayerName");
  const judgeInputs = document.getElementById("judgeInputs");

  if (!currentContestant) {
    if (scoringSection) scoringSection.style.display = "none";
    return;
  }

  if (scoringSection) scoringSection.style.display = "block";
  if (scoringPlayerName) scoringPlayerName.textContent = currentContestant;

  // Create input fields for each contestant (judges)
  if (judgeInputs) {
    judgeInputs.innerHTML = "";
    contestants.forEach((judgeName) => {
      const div = document.createElement("div");
      div.className = "judge-input-item";
      const label = document.createElement("label");
      label.textContent = judgeName + ":";
      label.setAttribute("for", `score-${judgeName}`);
      const input = document.createElement("input");
      input.type = "number";
      input.id = `score-${judgeName}`;
      input.min = "1";
      input.max = "10";
      input.placeholder = "1-10";
      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          tallyScores();
        }
      });
      div.appendChild(label);
      div.appendChild(input);
      judgeInputs.appendChild(div);
    });
  }
}

// Tally scores from all judges and calculate average
function tallyScores() {
  if (!currentContestant) {
    alert("No contestant selected!");
    return;
  }

  const judgeScores = [];
  let allFilled = true;

  contestants.forEach((judgeName) => {
    const input = document.getElementById(`score-${judgeName}`);
    if (input) {
      const score = parseInt(input.value);
      if (isNaN(score) || score < 1 || score > 10) {
        allFilled = false;
      } else {
        judgeScores.push(score);
      }
    }
  });

  if (judgeScores.length === 0) {
    alert("Please enter at least one score!");
    return;
  }

  if (!allFilled) {
    if (!confirm("Some scores are missing or invalid. Calculate average with available scores?")) {
      return;
    }
  }

  // Calculate average
  const average = judgeScores.reduce((sum, score) => sum + score, 0) / judgeScores.length;
  const roundedAverage = Math.round(average * 10) / 10; // Round to 1 decimal place

  // Store contestant name before clearing
  const contestantName = currentContestant;

  // Add or update score
  const existingIndex = scores.findIndex((s) => s.name.toLowerCase() === currentContestant.toLowerCase());
  if (existingIndex >= 0) {
    scores[existingIndex].score = roundedAverage;
  } else {
    scores.push({ name: currentContestant, score: roundedAverage });
  }

  // Sort by score (highest first)
  scores.sort((a, b) => b.score - a.score);

  // Clear scoring section and reset for next contestant
  updateScoreboard();
  saveData();

  // Clear current contestant and allow spinning for new name
  currentContestant = null;
  const selectedNameEl = document.getElementById("selectedName");
  if (selectedNameEl) {
    selectedNameEl.parentElement.classList.remove("show");
  }

  const challengeButton = document.getElementById("spinChallengeButton");
  if (challengeButton) {
    challengeButton.disabled = true;
    challengeButton.textContent = "Spin for name first";
  }

  document.getElementById("challengeResult").classList.remove("show");
  updateScoringSection();

  alert(`${contestantName} scored ${roundedAverage}/10 (average of ${judgeScores.length} judge${judgeScores.length > 1 ? "s" : ""})!`);
}

// Update scoreboard display
function updateScoreboard() {
  const scoresList = document.getElementById("scoresList");
  scoresList.innerHTML = "";

  if (scores.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No scores yet. Be the first!";
    li.style.fontStyle = "italic";
    li.style.color = "#666";
    scoresList.appendChild(li);
    return;
  }

  scores.forEach((entry, index) => {
    const li = document.createElement("li");
    const medal = index === 0 ? "🥇 " : index === 1 ? "🥈 " : index === 2 ? "🥉 " : "";
    li.innerHTML = `<span class="name">${medal}${entry.name}</span><span class="score">${entry.score}/10</span>`;
    scoresList.appendChild(li);
  });
}

// Clear all scores
function clearScores() {
  if (confirm("Are you sure you want to clear all scores?")) {
    scores = [];
    updateScoreboard();
    saveData();
  }
}

// Reset used contestants
function resetContestants() {
  if (confirm("Reset all contestants? This will allow everyone to be selected again.")) {
    usedContestants = [];
    currentContestant = null;
    updateContestantsList();
    saveData();

    const selectedNameEl = document.getElementById("selectedName");
    if (selectedNameEl) {
      selectedNameEl.parentElement.classList.remove("show");
    }

    const challengeButton = document.getElementById("spinChallengeButton");
    if (challengeButton) {
      challengeButton.disabled = true;
      challengeButton.textContent = "Spin for name first";
    }

    document.getElementById("challengeResult").classList.remove("show");
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  loadData();
  updateContestantsList();

  const spinNameButton = document.getElementById("spinNameButton");
  if (spinNameButton) {
    spinNameButton.addEventListener("click", spinForName);
  }

  const spinChallengeButton = document.getElementById("spinChallengeButton");
  if (spinChallengeButton) {
    spinChallengeButton.addEventListener("click", generateChallenge);
    spinChallengeButton.disabled = true;
  }

  // Initialize scoring section
  updateScoringSection();
});
