const token = localStorage.getItem("token");
if (!token) location.href = "index.html";

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
    if (typeof renderChart === "function") renderChart(students);
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

    const rankClass =
      i === 0 ? "rank-1" :
      i === 1 ? "rank-2" :
      i === 2 ? "rank-3" : "";

    return `
      <tr class="row-enter ${rankClass}">
        <td>${i + 1}</td>
        <td>${highlight(s.id, q)}</td>
        <td>${highlight(s.name, q)}</td>

        ${SUBJECT_CONFIG.map(sub => {
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
  const avg = count ? Math.round(data.reduce((a, c) => a + c.total, 0) / count) : 0;
  const top = data[0];

  stats.innerHTML = `
    Students: ${count} |
    Avg: ${avg} |
    Top: ${top ? top.name + " (" + top.total + ")" : "-"}
  `;
}

// 🎨 BADGE
function getGradeBadge(grade) {
  if (grade === "A+") return `<span class="badge ap">A+</span>`;
  if (grade === "A") return `<span class="badge a">A</span>`;
  if (grade === "B") return `<span class="badge b">B</span>`;
  return `<span class="badge f">F</span>`;
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
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 20;
  doc.text("Student Result", 20, 10);

  students.forEach((s, i) => {
    doc.text(`${i+1}. ${s.name} (${s.total})`, 10, y);
    y += 10;
  });

  doc.save("result.pdf");
}

// 🔐 LOGOUT
function logout() {
  localStorage.clear();
  location.href = "index.html";
}

// 🎨 THEME
function toggleTheme(){
  document.body.classList.toggle("light");
}

// 🚀 INIT
// smooth load animation
document.body.style.opacity = 0;
window.onload = ()=>{
  document.body.style.transition="0.5s";
  document.body.style.opacity = 1;
};
function logout(){
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  location.href = "index.html"; // public/index.html
} 
loadStudents();