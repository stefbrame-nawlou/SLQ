// temp test
let wordToSign = true;

// DOM
const wordContainer = document.getElementById("wordContainer");
const videoContainer = document.getElementById("videoContainer");
const checkBtn = document.getElementById("checkBtn");
const correctBtn = document.getElementById("correctBtn");
const wrongBtn = document.getElementById("wrongBtn");

// Load from previous page
const state = JSON.parse(localStorage.getItem("slq_state")) || {};
const selections = state.selections || [];

let quizItems = [];
let currentIndex = 0;

async function loadQuiz() {
  for (const sel of selections) {
    const dataRes = await fetch(`data/${sel.categoryFile}`) // check
    const data = await dataRes.json();

    // slice selected group
    const start = sel.groupIndex * 10;
    const end = start + 10;
    const groupWords = data.words.slice(start, end);

    quizItems.push(...groupWords);

    quizItems = quizItems.sort(() => Math.random()-0.5);

    showNext();
  }

  function showNext() {
    if (currentIndex >= quizItems.length) {
      showResults();
      return;
    }

    const item = quizItems[currentIndex];

    wordContainer.textContent = item.word;
    wordContainer.style.display = wordToSign ? "block" : "none";

    videoContainer.innerHTML = item.videos
      .map(v => `<video src="videos/${v}" controls></video>`)
      .join("");
    videoContainer.style.display = wordToSign ? "none": "block";

    checkBtn.style.display = "inline-block";
    correctBtn.style.display = "none";
    wrongBtn.style.display = "none";
  }

  checkBtn.addEventListener("click", () => {
    wordContainer.style.display = "block";
    videoContainer.style.display = "block";
    
    correctBtn.style.display = "block";
    wrongBtn.style.display = "block";
  });
  
  correctBtn.addEventListener("click", () => {
    state.score = state.score || {correct: 0, wrong: 0};
    state.score.correct++;
    localStorage.setItem("slq_state", JSON.stringify(state));
    showNext();
  });
  
  wrongBtn.addEventListener("click", () => {
    state.score = state.score || {correct: 0, wrong: 0};
    state.score.wrong++;
    localStorage.setItem("slq_state", JSON.stringify(state));
    showNext();
  });
  
  function nextQuestion() {
    currentIndex++;
    showNext();
  }

  function showResults() {
    const score = state.score || { correct: 0, wrong: 0 };
    alert(`Quiz finished!\nCorrect: ${score.correct}\nWrong: ${score.wrong}`);
  }
}

loadQuiz();