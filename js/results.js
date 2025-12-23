const state = JSON.parse(localStorage.getItem("slq_state")) || {};
const score = state.score || {correct: 0, wrong: 0};
const results = state.results || {correct: [], wrong: []};

const wrongStatsEl = document.getElementById("wrongStats");
const correctStatsEl = document.getElementById("correctStats");

const wrongListEl = document.getElementById("wrongList");
const correctListEl = document.getElementById("correctList");

const total = score.correct + score.wrong;
const pctCorrect = total ? Math.round((score.correct/total)*100) : 0;
const pctWrong = total ? Math.round((score.wrong/total)*100) : 0;

function createInnerHTML(score, lbl, perc) {
  return `<p><strong>${score} ${lbl} (${perc}%)</strong></p>`
}

wrongStatsEl.innerHTML = createInnerHTML(score.wrong, "erreurs", pctWrong);
correctStatsEl.innerHTML = createInnerHTML(score.correct, "correct", pctCorrect);

function renderList(container, items) {
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "";
    container.appendChild(li);
    return;
  }

  items.forEach(item => {
    const li = document.createElement("li");
    // const wordSpan = document.createElement("strong");
    // wordSpan.textContent = item.word + ": ";
    // li.appendChild(wordSpan);

    item.videos.forEach((video, idx) => {
      const link = document.createElement("a");
      link.href = `videos/${video}`;
      link.target = "_blank";
      link.textContent = 
        item.videos.length > 1
          ? `${item.word} (${idx +1})`
          : item.word;
      
      li.appendChild(link);

      if (idx < item.videos.length - 1) {
        li.appendChild(document.createTextNode(" | "));
      }      
    });
    container.appendChild(li);
  });
}

renderList(wrongListEl, results.wrong || []);
renderList(correctListEl, results.correct || []);