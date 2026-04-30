const SUBJECT_CONFIG = [
  { key: "math", label: "Mathematics", icon: "📐" },
  { key: "eng",  label: "English",     icon: "📘" },
  { key: "sci",  label: "Science",     icon: "🔬" },
  { key: "prog", label: "Programming", icon: "💻" }
];
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
  fetch("/students", {
    headers: { Authorization: token }
  })
  .then(res => res.json())
  .then(data => {
    console.log("DATA:", data); // 🔍 check

    students = data.sort((a, b) => b.total - a.total);

    render(students);

    // chart থাকলে
    if (typeof renderChart === "function") {
      renderChart(students);
    }
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
function render(data) {
  renderHeader();

  table.innerHTML = data.map((s, i) => `
    <tr class="row-enter">
      <td>${i + 1}</td>
      <td>${s.id}</td>
      <td>${s.name}</td>

      ${SUBJECT_CONFIG.map(sub => {
        const val = s.subjects?.[sub.key] ?? 0; // missing হলে 0
        return `<td>${progress(val)}</td>`;
      }).join("")}

      <td>${s.total}</td>
      <td>${getGradeBadge(s.grade)}</td>
    </tr>
  `).join("");





  // small delay for smoother feel
  setTimeout(() => {
    tbody.innerHTML = html;
    tbody.style.opacity = "1";
  }, 60);
}

function renderHeader() {
  thead.innerHTML = `
    <tr>
      <th>Rank</th>
      <th>ID</th>
      <th>Name</th>

      ${SUBJECT_CONFIG.map(s => `
        <th>
          <span class="sub-icon">${s.icon}</span>
          ${s.label}
        </th>
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
  const top = data.reduce((m, c) => c.total > (m?.total || -1) ? c : m, null);

  document.getElementById("stats").innerHTML = `
    <b>Students:</b> ${count} |
    <b>Average:</b> ${avg} |
    <b>Top:</b> ${top ? `${top.name} (${top.total})` : "-"}
  `;
}

// 🚀 INIT
loadStudents();
function toggleTheme(){
  const b = document.body;
  if (b.classList.contains("dark")){
    b.classList.remove("dark"); b.classList.add("light");
    localStorage.setItem("theme","light");
  } else {
    b.classList.remove("light"); b.classList.add("dark");
    localStorage.setItem("theme","dark");
  }
}

// default theme
const saved = localStorage.getItem("theme");
if (saved) document.body.classList.add(saved);
else {
  // admin → dark, user → light (you can set per page)
  // e.g., in admin.js: document.body.classList.add("dark");
  //       in user.js:  document.body.classList.add("light");
}
function getGradeBadge(grade) {
  if (grade === "A+") return `<span class="badge ap">A+</span>`;
  if (grade === "A") return `<span class="badge a">A</span>`;
  if (grade === "B") return `<span class="badge b">B</span>`;
  return `<span class="badge f">F</span>`;
}
function progress(val) {
  return `
    <div class="progress-box">
      <div class="progress-bar" style="width:${val}%"></div>
      <span>${val}</span>
    </div>
  `;
}

function renderChart(data) {
  const names = data.map(s => s.name);
  const totals = data.map(s => s.total);

  new Chart(document.getElementById("chart"), {
    type: "bar",
    data: {
      labels: names,
      datasets: [{
        label: "Total Marks",
        data: totals
      }]
    }
  });
}
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Student Result", 20, 10);

  let y = 20;

  students.forEach((s, i) => {
    doc.text(
      `${i+1}. ${s.name} | Total: ${s.total} | Grade: ${s.grade}`,
      10,
      y
    );
    y += 10;
  });

  doc.save("result.pdf");
}

Object.entries(s.subjects).map(([sub, val]) => `
  <td>${progress(val)}</td>
`).join("")

function renderHeader(data) {
  if (!data.length) return;

  const subjects = Object.keys(data[0].subjects || {});

  thead.innerHTML = `
    <tr>
      <th>Rank</th>
      <th>ID</th>
      <th>Name</th>
      ${subjects.map(s => `<th>${s.toUpperCase()}</th>`).join("")}
      <th>Total</th>
      <th>Grade</th>
    </tr>
  `;
}