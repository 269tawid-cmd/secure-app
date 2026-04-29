const token = localStorage.getItem("token");
if (!token) location.href = "index.html";

function logout() {
  localStorage.clear();
  location.href = "index.html";
}

let students = [];

// 🔄 LOAD
function loadStudents() {
  fetch("/students", {
    headers: { Authorization: token }
  })
  .then(res => {
    if (res.status === 401) location.href = "index.html";
    return res.json();
  })
  .then(data => {
    students = data;
    applyAll(); // render with filters/sort
  });
}

// 🧠 APPLY: search + filter + sort
function applyAll() {
  const q = (search.value || "").toLowerCase();
  const g = gradeFilter.value;
  const sort = sortOrder.value;

  let data = students
    // 🔎 search (name বা id)
    .filter(s =>
      s.name.toLowerCase().includes(q) ||
      String(s.id).toLowerCase().includes(q)
    )
    // 🎚️ grade filter
    .filter(s => !g || s.grade === g);

  // ↕️ sort by total
  if (sort === "asc") data.sort((a, b) => a.total - b.total);
  if (sort === "desc") data.sort((a, b) => b.total - a.total);

  render(data);
  renderStats(data);
}

// 🖥️ RENDER TABLE
function render(data) {
  table.innerHTML = data.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
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

  stats.innerHTML = `
    <b>Students:</b> ${count} |
    <b>Average:</b> ${avg} |
    <b>Top:</b> ${top ? `${top.name} (${top.total})` : "-"}
  `;
}

loadStudents();