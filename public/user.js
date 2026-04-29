const token = localStorage.getItem("token");

if (!token) location.href = "index.html";

function logout() {
  localStorage.clear();
  location.href = "index.html";
}

let students = [];

// 🔄 load data
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
    render(data);
  });
}

// 🖥️ render table
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

// 🔍 search
function searchStudent() {
  const val = search.value.toLowerCase();

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(val)
  );

  render(filtered);
}

loadStudents();