const token = localStorage.getItem("token");
if (!token) location.href = "index.html";

function logout() {
  localStorage.clear();
  location.href = "index.html";
}

let students = [];
let debounceTimer = null;

// 🔄 LOAD
function loadStudents() {
  const tbody = document.getElementById("table");
  tbody.classList.add("loading");
  // optional skeleton
  tbody.innerHTML = Array.from({length: 5}).map(() =>
    `<tr class="skeleton"><td colspan="8"></td></tr>`
  ).join("");

  fetch("/students", { headers: { Authorization: token } })
    .then(res => res.json())
    .then(data => {
      students = data;
      applyAll(); // initial render
      tbody.classList.remove("loading");
    });
}

// 🧠 APPLY (debounced)
function onSearchInput() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(applyAll, 200); // 200ms debounce
}

function applyAll() {
  const q = (document.getElementById("search")?.value || "").toLowerCase();
  const g = document.getElementById("gradeFilter")?.value;
  const sort = document.getElementById("sortOrder")?.value;

  let data = students
    .filter(s =>
      s.name.toLowerCase().includes(q) ||
      String(s.id).toLowerCase().includes(q)
    )
    .filter(s => !g || s.grade === g);

  if (sort === "asc") data.sort((a, b) => a.total - b.total);
  if (sort === "desc") data.sort((a, b) => b.total - a.total);

  render(data, q);
  renderStats(data);
}

// 🔤 highlight helper
function highlight(text, q) {
  if (!q) return text;
  const re = new RegExp(`(${q})`, "ig");
  return String(text).replace(re, "<mark>$1</mark>");
}

// 🖥️ RENDER (with animation + highlight)
function render(data, q) {
  const tbody = document.getElementById("table");

  // slight fade out then replace
  tbody.style.opacity = "0.6";

  const html = data.map(s => `
    <tr class="row-enter">
      <td>${highlight(s.id, q)}</td>
      <td>${highlight(s.name, q)}</td>
      <td>${s.math}</td>
      <td>${s.eng}</td>
      <td>${s.sci}</td>
      <td>${s.prog}</td>
      <td>${s.total}</td>
      <td>${s.grade}</td>
    </tr>
  `).join("");

  // small delay for smoother feel
  setTimeout(() => {
    tbody.innerHTML = html;
    tbody.style.opacity = "1";
  }, 60);
}

// 📊 STATS
function renderStats(data) {
  const count = data.length;
  const avg = count ? Math.round(data.reduce((a, c) => a + c.total, 0) / count) : 0;
  const top = data.reduce((m, c) => c.total > (m?.total || -1) ? c : m, null);

  document.getElementById("stats").innerHTML = `
    <b>Students:</b> ${count} |
    <b>Average:</b> ${avg} |
    <b>Top:</b> ${top ? `${top.name} (${top.total})` : "-"}
  `;
}

// 🚀 INIT
loadStudents();