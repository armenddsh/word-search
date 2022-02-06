const words = [
  "ability",
  "able",
  "about",
  "above",
  "accept",
  "according",
  "yourself"
];
const rowsCount = 9;
const colsCount = 9;
const searchMode = ["left-right", "top-down", "down-right", "up-right"];
// const searchMode = ["left-right", "top-down"];
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

let startMoving = null;
let selectedCells = [];

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomSearchMode() {
  const random = randomIntFromInterval(0, searchMode.length - 1);
  return searchMode[random];
}

function createGrid(gameEl, rowsCount, colsCount) {
  for (let k = 0; k < rowsCount; k++) {
    const row = $(`<div id="r-${k}" data-type="row" class="row"></di>`);
    for (let m = 0; m < colsCount; m++) {
      const col = $(
        `<div id="r-${k}-c-${m}" data-type="col" class="col"></div>`
      );
      row.append(col);
    }
    gameEl.append(row);
  }
}

function getAndSetValue(id, letter) {
  const cell = $(id);
  const value = cell.text();
  if (!value) {
    cell.text(letter);
  }
}

function leftRight(rowsCount, colsCount, word) {
  for (let row = 0; row < rowsCount; row++) {
    for (let col = 0; col < colsCount; col++) {
      const exactMatches = [];

      for (let w = 0; w < word.length; w++) {
        const nextCell = `#r-${row}-c-${w + col}`;
        const cell = $(nextCell);
        const cellValue = cell.text();
        if (cellValue === "" || cellValue === word[w]) {
          exactMatches.push({ cell: nextCell, value: true, word: word[w] });
        } else {
          exactMatches.push({ cell: nextCell, value: false, word: word[w] });
        }
      }
      if (exactMatches.every((f) => f.value === true)) {
        for (let exactMatch of exactMatches) {
          $(exactMatch.cell).text(exactMatch.word);
        }
        console.log("Fill Word", word);
        return true;
      }
    }
  }
  return false;
}

function topDown(rowsCount, colsCount, word) {
  for (let row = 0; row < rowsCount; row++) {
    for (let col = 0; col < colsCount; col++) {
      const exactMatches = [];

      for (let w = 0; w < word.length; w++) {
        const nextCell = `#r-${row + w}-c-${col}`;
        const cell = $(nextCell);
        const cellValue = cell.text();
        if (cellValue === "" || cellValue === word[w]) {
          exactMatches.push({ cell: nextCell, value: true, word: word[w] });
        } else {
          exactMatches.push({ cell: nextCell, value: false, word: word[w] });
        }
      }
      if (exactMatches.every((f) => f.value === true)) {
        for (let exactMatch of exactMatches) {
          $(exactMatch.cell).text(exactMatch.word);
        }
        console.log("Fill Word", word);
        return true;
      }
    }
  }
  return false;
}

function downRight(rowsCount, colsCount, word) {
  for (let row = 0; row < rowsCount; row++) {
    const exactMatches = [];
    for (let col = 0; col < colsCount; col++) {
      for (let w = 0; w < word.length; w++) {
        const nextCell = `#r-${row + w}-c-${col + w}`;
        const cell = $(nextCell);
        const cellValue = cell.text();
        if (cellValue === "" || cellValue === word[w]) {
          exactMatches.push({ cell: nextCell, value: true, word: word[w] });
        } else {
          exactMatches.push({ cell: nextCell, value: false, word: word[w] });
        }
      }
      if (exactMatches.every((f) => f.value === true)) {
        for (let exactMatch of exactMatches) {
          $(exactMatch.cell).text(exactMatch.word);
        }
        console.log("Fill Word", word);
        return true;
      }
    }
  }
  return false;
}

function topRight(rowsCount, colsCount, word) {
  for (let row = 0; row < rowsCount; row++) {
    const exactMatches = [];
    for (let col = 0; col < colsCount; col++) {
      for (let w = 0; w < word.length; w++) {
        const nextCell = `#r-${row - w}-c-${col + w}`;
        const cell = $(nextCell);
        const cellValue = cell.text();
        if (cellValue === "" || cellValue === word[w]) {
          exactMatches.push({ cell: nextCell, value: true, word: word[w] });
        } else {
          exactMatches.push({ cell: nextCell, value: false, word: word[w] });
        }
      }
      if (exactMatches.every((f) => f.value === true)) {
        for (let exactMatch of exactMatches) {
          $(exactMatch.cell).text(exactMatch.word);
        }
        console.log("Fill Word", word);
        return true;
      }
    }
  }
  return false;
}

function fillWords(gameEl, rowsCount, colsCount, words) {
  const wordsSortedDesc = words.sort((a, b) => b.length - a.length);
  const wordsInGrid = [];
  for (const word of wordsSortedDesc) {
    const searchM = getRandomSearchMode();
    if (searchM === "left-right") {
      const result = leftRight(rowsCount, colsCount, word);
      result && wordsInGrid.push(word);
    }
    if (searchM === "top-down") {
      const result = topDown(rowsCount, colsCount, word);
      result && wordsInGrid.push(word);
    }
    if (searchM === "down-right") {
      const result = downRight(rowsCount, colsCount, word);
      result && wordsInGrid.push(word);
    }
    if (searchM === "up-right") {
      const result = topRight(rowsCount, colsCount, word);
      result && wordsInGrid.push(word);
    }
  }
  return wordsInGrid;
}

function randomCharacter() {
  return alphabet[randomIntFromInterval(0, alphabet.length - 1)];
}

function fillWithRandom(gameEl, rowsCount, colsCount) {
  for (let row = 0; row < rowsCount; row++) {
    for (let col = 0; col < colsCount; col++) {
      const cellId = `#r-${row}-c-${col}`;
      const cell = $(cellId);
      const cellValue = cell.text();
      if (cellValue === "") {
        cell.text(randomCharacter());
      }
    }
  }
}

function addWordsToList(wordsFillInGrid) {
  for (let word of wordsFillInGrid) {
    $("#words").append(`<li class="word">${word}</li>`);
  }
}

$(document).ready(() => {
  const gameEl = $("#game");
  createGrid(gameEl, rowsCount, colsCount);
  const wordsFillInGrid = fillWords(gameEl, rowsCount, colsCount, words);
  addWordsToList(wordsFillInGrid);
  fillWithRandom(gameEl, rowsCount, colsCount);
  
  $(".col").on("mousedown", (event) => {
    const el = $("#" + event.target.id);
    el.css("background-color", "darkgray");
    startMoving = "#" + event.target.id;
    selectedCells = [startMoving];
  });
  
  $(".col").on("mouseover", (event) => {
    if (startMoving) {
      const el = $("#" + event.target.id);
      el.css("background-color", "darkgray");
      selectedCells.push("#" + event.target.id);
    }
  });
  
  $(".col").on("mouseup", (event) => {
    for(const s of selectedCells) {
      $(s).css("background-color", "darkgray");
    }

    startMoving = null;
    selectedCells = [];
    
  });
  
});
