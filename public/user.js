// 🔐 auth guard
const token = localStorage.getItem("token");
if (!token) location.href = "index.html";

// DOM refs
const table = document.getElementById("table");
const thead = document.getElementById("thead");
const search = document.getElementById("search");
const gradeFilter = document.getElementById("gradeFilter");
const sortOrder = document.getElementById("sortOrder");
const stats = document.getElementById("stats");

// subjects config
const SUBJECT_CONFIG = [
  { key: "math", label: "Mathematics", icon: "📐" },
  { key: "eng",  label: "English",     icon: "📘" },
  { key: "sci",  label: "Science",     icon: "🔬" },
  { key: "prog", label: "Programming", icon: "💻" }
];

let students = [];
let debounceTimer = null;

// 🔄 LOAD
function loadStudents() {
  fetch("/students", {
    headers: { Authorization: token }
  })
  .then(res => res.json())
  .then(data => {
    students = data.sort((a, b) => b.total - a.total);
    applyAll();
    renderChart(students);
  });
}

// 🔍 SEARCH
function onSearchInput() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(applyAll, 200);
}

// 🎯 FILTER + SORT
function applyAll() {
  const q = (search.value || "").toLowerCase();
  const g = gradeFilter.value;
  const sort = sortOrder.value;

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

// 🔤 highlight
function highlight(text, q) {
  if (!q) return text;
  return String(text).replace(new RegExp(q, "gi"), m => `<mark>${m}</mark>`);
}


// 🖥️ RENDER
function render(data, q="") {
  renderHeader();

  table.innerHTML = data.map((s, i) => {
    return `
      <tr>
        <td>${i + 1}</td>
        <td>${highlight(s.id, q)}</td>
        <td>${highlight(s.name, q)}</td>

        ${SUBJECT_CONFIG.map(sub => {
          // ✅ FIXED LINE
          const val = s.subjects?.[sub.key] ?? s[sub.key] ?? 0;

          return `<td>${progress(val)}</td>`;
        }).join("")}

        <td>${s.total}</td>
        <td>${getGradeBadge(s.grade)}</td>
      </tr>
    `;
  }).join("");
}

// 📊 HEADER
function renderHeader() {
  thead.innerHTML = `
    <tr>
      <th>#</th>
      <th>ID</th>
      <th>Name</th>
      ${SUBJECT_CONFIG.map(s => `
        <th>${s.icon} ${s.label}</th>
      `).join("")}
      <th>Total</th>
      <th>Grade</th>
    </tr>
  `;
}

// 📊 STATS
function renderStats(data) {
  const count = data.length;
  const avg = count
    ? Math.round(data.reduce((a, c) => a + c.total, 0) / count)
    : 0;

  const top = data[0];

  stats.innerHTML = `
    Students: ${count} |
    Avg: ${avg} |
    Top: ${top ? top.name + " (" + top.total + ")" : "-"}
  `;
}

// 🎨 BADGE
function getGradeBadge(grade) {
  return `<span class="badge">${grade}</span>`;
}

// 📊 PROGRESS
function progress(val) {
  return `
    <div class="progress-box">
      <div class="progress-bar" style="width:${val}%"></div>
      <span>${val}</span>
    </div>
  `;
}

// 📈 CHART
let chartInstance;
function renderChart(data) {
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(document.getElementById("chart"), {
    type: "bar",
    data: {
      labels: data.map(s => s.name),
      datasets: [{
        label: "Total Marks",
        data: data.map(s => s.total)
      }]
    }
  });
}

// 🧾 PDF
function downloadPDF() {
  alert("PDF feature optional – need jsPDF CDN");
}

// 🔐 LOGOUT
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  location.href = "index.html";
}

// 🎨 THEME
function toggleTheme(){
  document.body.classList.toggle("light");
}

// 🚀 INIT
window.onload = () => {
  document.body.style.opacity = 1;
  loadStudents();
};

// ===== THEME =====
function applyTheme(theme){
  document.body.classList.remove("light","dark");
  document.body.classList.add(theme);
}

function toggleTheme(){
  const isDark = document.body.classList.contains("dark");
  const next = isDark ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
}

// on load
(function initTheme(){
  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);
})();