const menuEl = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");

async function loadMenu() {
  const categoriesRes = await fetch("data/categories.json");
  const categories = await categoriesRes.json();

  categories.forEach(async (cat) => {
    const catRes = await fetch(`data/${cat.file}`)
    const catData = await catRes.json();

    const totalWords = catData.words.length;
    const totalGroups = Math.ceil(totalWords/10);

    const catDiv = document.createElement("div");
    catDiv.className = "category";
    
    //category title
    const title = document.createElement("div");
    title.className = "category-title";
    title.textContent = cat.label
    catDiv.appendChild(title);
    
    for (let i = 0; i < totalGroups; i++){
      const groupDiv = document.createElement("div");
      groupDiv.className = "group";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox"
      checkbox.className = "group-checkbox";
      checkbox.id = `${cat.file}-group-${i}`;
      checkbox.dataset.categoryFile = cat.file;
      checkbox.dataset.groupIndex = i;

      const start = i*10 +1;
      const end = Math.min((i + 1)*10, totalWords);

      const label = document.createElement("label");
      label.setAttribute("for", checkbox.id);
      label.textContent = `Words ${start}-${end}`;

      // Optional tooltip (hover to see words)
      label.title = catData.words.slice(i*10, (i+1)*10).map(w => w.word).join(", ");

      groupDiv.appendChild(checkbox);
      groupDiv.appendChild(label);
      catDiv.appendChild(groupDiv);
    }

    menuEl.appendChild(groupDiv);
  });
}

// startBtn.querySelectorAll("input.group-checkbox:checked").forEach(cb => {
//   selectedGroups.push({
//     categoryFile
//   })
// })