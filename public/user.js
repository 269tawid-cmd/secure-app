// 🔐 auth guard
const token = localStorage.getItem("token");
if (!token) location.href = "login.html";

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
  table.innerHTML = data.map((s, i) => {
    return `
      <tr>
        <td style="font-weight: 600; color: var(--accent-color);">${highlight(s.id, q)}</td>
        <td style="font-weight: 500;">${highlight(s.name, q)}</td>
        <td style="width: 300px;">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${SUBJECT_CONFIG.map(sub => {
              const val = s.subjects?.[sub.key] ?? s[sub.key] ?? 0;
              return `
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem;">
                  <span style="color: var(--text-secondary);">${sub.label}</span>
                  <span style="font-weight: 600;">${val}</span>
                </div>
                <div class="progress-container" style="height: 4px;">
                  <div class="progress-bar" style="width: ${val}%;"></div>
                </div>
              `;
            }).join("")}
          </div>
        </td>
        <td style="font-weight: 700; font-size: 1.1rem;">${s.total}</td>
        <td>${getGradeBadge(s.grade)}</td>
      </tr>
    `;
  }).join("");
}

// 📊 STATS
function renderStats(data) {
  const count = data.length;
  const avg = count
    ? Math.round(data.reduce((a, c) => a + c.total, 0) / count)
    : 0;

  const top = data[0];

  stats.innerHTML = `
    <div class="card" style="padding: 1rem; border-left: 4px solid var(--accent-color);">
      <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 700;">Total Students</div>
      <div style="font-size: 1.5rem; font-weight: 700;">${count}</div>
    </div>
    <div class="card" style="padding: 1rem; border-left: 4px solid var(--success-color);">
      <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 700;">Average Marks</div>
      <div style="font-size: 1.5rem; font-weight: 700;">${avg}</div>
    </div>
    <div class="card" style="padding: 1rem; border-left: 4px solid gold;">
      <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 700;">Top Performer</div>
      <div style="font-size: 1.1rem; font-weight: 700;">${top ? top.name : "N/A"}</div>
      <div style="font-size: 0.8rem; color: var(--text-secondary);">${top ? "Score: " + top.total : ""}</div>
    </div>
  `;
}

// 🎨 BADGE
function getGradeBadge(grade) {
  let color = "var(--accent-color)";
  let bg = "rgba(59, 130, 246, 0.1)";
  
  if (grade === "A+") { color = "#10b981"; bg = "rgba(16, 185, 129, 0.1)"; }
  else if (grade === "F") { color = "#ef4444"; bg = "rgba(239, 68, 68, 0.1)"; }
  
  return `<span style="
    padding: 6px 12px; 
    border-radius: 999px; 
    font-size: 0.75rem; 
    font-weight: 700;
    background: ${bg};
    color: ${color};
    border: 1px solid ${color.replace(')', ', 0.2)')};
  ">${grade}</span>`;
}

// 📈 CHART
let chartInstance;
function renderChart(data) {
  if (chartInstance) chartInstance.destroy();

  const ctx = document.getElementById("chart").getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map(s => s.name),
      datasets: [{
        label: "Total Marks",
        data: data.map(s => s.total),
        backgroundColor: gradient,
        borderColor: '#3b82f6',
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        }
      }
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
  location.href = "login.html";
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

const themeBtn = document.querySelector(".btn.ghost");

function updateThemeBtn(){
  if(!themeBtn) return;
  themeBtn.innerText =
    document.body.classList.contains("dark")
    ? "Light"
    : "Dark";
}

// update after toggle
function toggleTheme(){
  const isDark = document.body.classList.contains("dark");
  const next = isDark ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
  updateThemeBtn();
}

// on load
(function initTheme(){
  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);
  updateThemeBtn();
})();