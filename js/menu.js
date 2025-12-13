const menuEl = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");

async function loadMenu() {
  let categories;
  try {
    const categoriesRes = await fetch("data/categories.json");
    categories = await categoriesRes.json();
  } catch (err) {
    console.error("Error parsing categories.json:", err);
  }

  categories.filter(cat => cat.enabled);

  // use for...of instead of forEach(async)
  for (const cat of categories) {
    let catData;
    try {
      const catRes = await fetch(`data/${cat.file}`);
      catData = await catRes.json();
    } catch (err) {
      console.error(`Error parsing ${cat.file}:  ${err}`);
    }

    const totalWords = catData.words.length;
    const totalGroups = Math.ceil(totalWords / 10);

    const catDiv = document.createElement("div");
    catDiv.className = "category";

    // category title
    const title = document.createElement("div");
    title.className = "category-title";
    title.textContent = cat.label;
    catDiv.appendChild(title);

    // groups
    for (let i = 0; i < totalGroups; i++) {
      const groupDiv = document.createElement("div");
      groupDiv.className = "group";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "group-checkbox";
      checkbox.id = `${cat.file}-group-${i}`;
      checkbox.dataset.categoryFile = cat.file;
      checkbox.dataset.groupIndex = i;

      const start = i * 10 + 1;
      const end = Math.min((i + 1) * 10, totalWords);

      const label = document.createElement("label");
      label.setAttribute("for", checkbox.id);
      label.textContent = `${} ${start}-${end}`;
      label.title = catData.words.slice(i * 10, (i + 1) * 10).map(w => w.word).join(", ");

      groupDiv.appendChild(checkbox);
      groupDiv.appendChild(label);
      catDiv.appendChild(groupDiv);
    }

    menuEl.appendChild(catDiv);
  }
}

startBtn.addEventListener("click", () => {
  const selectedGroups = [];
  document.querySelectorAll("input.group-checkbox:checked").forEach(cb => {
    selectedGroups.push({
      categoryFile: cb.dataset.categoryFile,
      groupIndex: Number(cb.dataset.groupIndex)
    });
  });

  localStorage.setItem("slq_state", JSON.stringify({ selections: selectedGroups }));
  window.location.href = "quiz.html";
});

loadMenu();
