// temp test
let wordToSign = true;

// DOM
const wordContainer = document.getElementById("wordContainer");
const videoContainer = document.getElementById("videoContainer");
const checkBtn = document.getElementById("checkBtn");
const correctBtn = document.getElementById("correctBtn");
const wrongBtn = document.getElementById("wrongBtn");
const progress = document.getElementById("progress");
const pageTitle = document.getElementById("pageTitle");

// Load from previous page
const state = JSON.parse(localStorage.getItem("slq_state")) || {};
const selections = state.selections || [];

let quizItems = [];
let currentIndex = 0;
let refTitle = "";

async function loadQuiz() {
  refTitle = pageTitle.textContent;

  for (const sel of selections) {
    const dataRes = await fetch(`data/${sel.categoryFile}`);
    const data = await dataRes.json();

    // slice selected group
    const start = sel.groupIndex * 10;
    const end = start + 10;
    const groupWords = data.words.slice(start, end);

    quizItems.push(...groupWords);
  }

  quizItems = quizItems.sort(() => Math.random() - 0.5);
  showNext();
}

function showNext() {
  if (currentIndex >= quizItems.length) {
    showResults();
    return;
  }

  const item = quizItems[currentIndex];
  pageTitle.textContent = `${refTitle} ${currentIndex + 1}/${quizItems.length}`;
  // progress.textContent = `${refTitle} ${currentIndex + 1}/${quizItems.length}`;

  // Display word + video count if more than 1
  let displayTxt = item.word;
  if (item.videos.length > 1) displayTxt += ` (${item.videos.length} signes)`;
  wordContainer.textContent = displayTxt;
  wordContainer.style.display = wordToSign ? "block" : "none";

  // Clear previous videos
  videoContainer.innerHTML = "";
  videoContainer.style.display = wordToSign ? "none" : "flex";

  item.videos.forEach((v) => {
    const videoWrapper = document.createElement("div");
    videoWrapper.className = "video-wrapper";

    // Container for video + slider
    const videoWithControls = document.createElement("div");
    videoWithControls.style.display = "flex";
    videoWithControls.style.flexDirection = "column";
    videoWithControls.style.alignItems = "center";

    // Video element
    const videoEl = document.createElement("video");
    videoEl.src = `videos/${v}`;
    videoEl.controls = false;
    videoEl.autoplay = false; // autoplay only after Vérifier
    videoEl.muted = true; 
    videoEl.loop = true
    videoEl.style.width = "500px";
    videoEl.addEventListener("loadedmetadata", () => {
      videoEl.playbackRate = 1; // exact 100% speed
    });

    // Speed slider + label
    const speedInput = document.createElement("input");
    speedInput.type = "range";
    speedInput.min = "25";
    speedInput.max = "300";
    speedInput.step = "20";
    speedInput.value = "100";

    const speedLabel = document.createElement("span");
    speedLabel.textContent = `${speedInput.value}%`;

    speedInput.addEventListener("input", () => {
      const percent = parseInt(speedInput.value);
      speedLabel.textContent = `${percent}%`;
      videoEl.playbackRate = percent / 100;
    });

    // Append video + slider inside container
    videoWithControls.appendChild(videoEl);
    videoWithControls.appendChild(speedInput);
    videoWithControls.appendChild(speedLabel);

    // Append container to wrapper, wrapper to main videoContainer
    videoWrapper.appendChild(videoWithControls);
    videoContainer.appendChild(videoWrapper);
  });

  // Buttons visibility
  checkBtn.style.display = "inline-block";
  correctBtn.style.display = "none";
  wrongBtn.style.display = "none";
}


// Check button logic
checkBtn.addEventListener("click", () => {
  if (wordToSign) {
    // Reveal videos after checking
    videoContainer.style.display = "flex";
    videoContainer.querySelectorAll("video").forEach(v => v.play());
  } else {
    // Reveal word for videoToWord mode
    wordContainer.style.display = "block";
  }

  correctBtn.style.display = "block";
  wrongBtn.style.display = "block";
});

// Correct / Wrong buttons
correctBtn.addEventListener("click", () => nextQuestion(true));
wrongBtn.addEventListener("click", () => nextQuestion(false));

function nextQuestion(isCorrect) {
  state.score = state.score || { correct: 0, wrong: 0 };
  isCorrect ? state.score.correct++ : state.score.wrong++;
  localStorage.setItem("slq_state", JSON.stringify(state));
  currentIndex++;
  showNext();
}

// Keyboard shortcuts
document.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase();
  if (key === "V" && checkBtn) checkBtn.click();
  if (key === "C" && correctBtn) correctBtn.click();
  if (key === "F" && wrongBtn) wrongBtn.click();
  if (event.key === "ArrowUp") adjustVideoSpeed(20);
  if (event.key === "ArrowDown") adjustVideoSpeed(-20);
});

// Video speed adjustment
function adjustVideoSpeed(delta) {
  const videoWrappers = document.querySelectorAll(".video-wrapper");
  videoWrappers.forEach(wrapper => {
    const videoEl = wrapper.querySelector("video");
    const speedInput = wrapper.querySelector('input[type="range"]');
    const speedLabel = wrapper.querySelector("span");

    let currentSpeed = parseInt(speedInput.value);
    currentSpeed += delta;
    currentSpeed = Math.max(parseInt(speedInput.min), Math.min(parseInt(speedInput.max), currentSpeed));

    speedInput.value = currentSpeed;
    speedLabel.textContent = `${currentSpeed}%`;
    videoEl.playbackRate = currentSpeed / 100;
  });
}

// Show final results
function showResults() {
  const score = state.score || { correct: 0, wrong: 0 };
  alert(`Quiz finished!\nCorrect: ${score.correct}\nWrong: ${score.wrong}`);
}

loadQuiz();
