const token = localStorage.getItem("token");

if (!token) location.href = "index.html";

function logout() {
  localStorage.clear();
  location.href = "index.html";
}

let students = []; // 🔥 IMPORTANT

// 🔄 LOAD DATA
function loadStudents() {
  fetch("/students", {
    headers: { Authorization: token }
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);

    students = data;   // 🔥 store data
    applyAll();        // 🔥 direct render না, applyAll call
  });
}

// 🧠 APPLY: search + filter + sort
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

  render(data);
  renderStats(data);
}

// 🖥️ RENDER TABLE
function render(data) {
  const tableBody = document.getElementById("table");

  tableBody.innerHTML = data.map(s => `
    <tr class="fade">
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.math}</td>
      <td>${s.eng}</td>
      <td>${s.sci}</td>
      <td>${s.prog}</td>
      <td>${s.total}</td>
      <td>${s.grade}</td>
    </tr>
  `).join("");
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