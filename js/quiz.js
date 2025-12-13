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

    videoContainer.innerHTML = "";
    
    item.videos.forEach((v, idx) => {
      const videoWrapper = document.createElement("div");
      videoWrapper.className = "video-wrapper";

      const videoEl = document.createElement("video");
      videoEl.src = `videos/${v}`;
      videoEl.autoplay = true;
      videoEl.muted = true;
      videoEl.style.width = "200px";
      videoEl.style.marginRight = "10px";
      videoWrapper.appendChild(videoEl);

      const speedInput = document.createElement("input");
      speedInput.type = "range";
      speedInput.min = "25";
      speedInput.max = "300";
      speedInput.step = "20";
      speedInput.value = "100";

      const speedLabel = document.createElement("span");
      speedLabel.textContent =  `${speedInput.value}%`;

      speedInput.addEventListener("input", () => {
        const percent = parseInt(speedInput.value);
        speedLabel.textContent = `${percent}%`;
        videoEl.playbackRate = percent / 100; // convert to decimal
      });
      
      videoWrapper.appendChild(speedInput);
      videoWrapper.appendChild(speedLabel);
      
    });
    item.videos
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
    nextQuestion(true);
  });
  
  wrongBtn.addEventListener("click", () => {
    nextQuestion(false);
  });
  
  function nextQuestion(isCorrect) {
    state.score = state.score || {correct: 0, wrong: 0};
    isCorrect ? state.score.correct++ : state.score.wrong++;
    localStorage.setItem("slq_state", JSON.stringify(state));
    currentIndex++;
    showNext();
  }

  function showResults() {
    const score = state.score || { correct: 0, wrong: 0 };
    alert(`Quiz finished!\nCorrect: ${score.correct}\nWrong: ${score.wrong}`);
  }
}

loadQuiz();