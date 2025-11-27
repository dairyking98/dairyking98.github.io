---
layout: page
title: Thanksgiving 2025 Challenge
permalink: /thanksgiving2025/
description: Thanksgiving 2025 Solo Challenge Game
nav: false
---

<style>
.thanksgiving-game {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.game-header {
  text-align: center;
  margin-bottom: 2rem;
}

.game-header h1 {
  color: #d2691e;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.game-header p {
  color: #666;
  font-size: 1.1rem;
}

.contestants-list {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
}

.contestants-list h3 {
  margin-top: 0;
  color: #d2691e;
}

.contestants-list p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.spin-button {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 2rem auto;
  padding: 1rem 2rem;
  font-size: 1.3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #d2691e, #cd853f);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(210, 105, 30, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.spin-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(210, 105, 30, 0.4);
}

.spin-button:active {
  transform: translateY(0);
}

.challenge-result {
  background: #fff9e6;
  border: 2px solid #d2691e;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  display: none;
}

.challenge-result.show {
  display: block;
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.combined-sentence {
  font-size: 1.5rem;
  font-weight: bold;
  color: #8b4513;
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 2px dashed #d2691e;
}

.breakdown {
  margin-top: 1.5rem;
}

.breakdown h3 {
  color: #d2691e;
  margin-bottom: 1rem;
}

.category-item {
  background: white;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border-radius: 6px;
  border-left: 4px solid #d2691e;
}

.category-label {
  font-weight: bold;
  color: #8b4513;
  display: inline-block;
  min-width: 150px;
}

.scoreboard {
  margin-top: 3rem;
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #ddd;
}

.scoreboard h3 {
  color: #d2691e;
  margin-top: 0;
}

.score-input {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.score-input input {
  flex: 1;
  min-width: 150px;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.score-input button {
  padding: 0.75rem 1.5rem;
  background: #d2691e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.score-input button:hover {
  background: #b85a1a;
}

.scores-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.scores-list li {
  background: white;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #d2691e;
}

.scores-list li .name {
  font-weight: bold;
  color: #8b4513;
}

.scores-list li .score {
  font-size: 1.2rem;
  color: #d2691e;
  font-weight: bold;
}

.clear-scores {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.clear-scores:hover {
  background: #c82333;
}

.selected-name-container.show {
  display: block !important;
  animation: fadeIn 0.5s;
}

.available-contestants {
  margin: 0.5rem 0;
  color: #28a745;
  font-weight: 500;
}

.used-contestants {
  margin: 0.5rem 0;
  color: #6c757d;
}

.checked-off {
  text-decoration: line-through;
  opacity: 0.7;
}

.all-done {
  margin: 0.5rem 0;
  color: #d2691e;
  font-weight: bold;
  font-size: 1.1rem;
}

.reset-contestants:hover {
  background: #5a6268;
}

.spin-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #ccc;
}

.judge-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.judge-input-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.judge-input-item label {
  font-weight: bold;
  color: #8b4513;
  min-width: 100px;
}

.judge-input-item input {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  text-align: center;
}

.tally-button:hover {
  background: #218838;
}

#scoringSection {
  margin-bottom: 2rem;
}

.challenge-content.hidden {
  display: none !important;
}

.challenge-content.visible {
  display: block !important;
  animation: fadeIn 0.5s;
}

.toggle-challenge-button {
  transition: background 0.2s;
}

.toggle-challenge-button:hover {
  background: #5a6268 !important;
}

.act-button:hover {
  background: #218838 !important;
}

.act-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #6c757d !important;
}

#countdownDisplay {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
</style>

<div class="thanksgiving-game">
  <div class="game-header">
    <h1>🦃 Thanksgiving 2025 Challenge 🦃</h1>
    <p>Perform the weird combo and let your friends judge!</p>
  </div>

  <div class="contestants-list">
    <h3>Contestants</h3>
    <div id="contestantsList"></div>
    <button class="reset-contestants" onclick="resetContestants()" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">Reset Contestants</button>
  </div>

  <div class="selected-name-container" id="selectedNameContainer" style="text-align: center; margin: 2rem 0; display: none;">
    <div style="font-size: 1.2rem; color: #666; margin-bottom: 0.5rem;">Selected Contestant:</div>
    <div id="selectedName" style="font-size: 2rem; font-weight: bold; color: #d2691e;"></div>
  </div>

  <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin: 2rem 0;">
    <button class="spin-button" id="spinNameButton">🎯 Spin for Name 🎯</button>
    <button class="spin-button" id="spinChallengeButton" disabled>Spin for name first</button>
  </div>

  <div class="challenge-result" id="challengeResult">
    <div class="challenge-controls" style="text-align: center; margin-bottom: 1rem;">
      <button class="toggle-challenge-button" id="toggleChallengeButton" onclick="toggleChallengeVisibility()" style="padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">
        👁️ Show Challenge
      </button>
      <button class="act-button" id="actButton" onclick="startActCountdown()" style="padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; margin-left: 0.5rem;">
        🎬 Start Act
      </button>
    </div>
    <div id="countdownDisplay" style="text-align: center; font-size: 3rem; font-weight: bold; color: #d2691e; margin: 1rem 0; display: none;"></div>
    <div class="challenge-content" id="challengeContent" style="display: none;">
      <div class="combined-sentence" id="combinedSentence"></div>
      <div class="breakdown">
        <h3>Breakdown:</h3>
        <div id="breakdownList"></div>
      </div>
    </div>
  </div>

  <div class="scoreboard">
    <h3>📊 Scoreboard</h3>
    <div id="scoringSection" style="display: none;">
      <div class="current-player" id="currentPlayerDisplay" style="margin-bottom: 1rem; padding: 1rem; background: #fff9e6; border-radius: 8px; border: 2px solid #d2691e;">
        <strong>Scoring for: <span id="scoringPlayerName" style="color: #d2691e; font-size: 1.2rem;"></span></strong>
      </div>
      <div class="judge-scores">
        <h4 style="margin-bottom: 1rem; color: #8b4513;">Judge Scores (1-10):</h4>
        <div id="judgeInputs" class="judge-inputs"></div>
        <button class="tally-button" onclick="tallyScores()" style="margin-top: 1rem; padding: 0.75rem 2rem; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: bold;">Tally Scores</button>
      </div>
    </div>
    <ul class="scores-list" id="scoresList"></ul>
    <button class="clear-scores" onclick="clearScores()">Clear All Scores</button>
  </div>
</div>

<script src="/assets/js/thanksgiving-game.js"></script>
