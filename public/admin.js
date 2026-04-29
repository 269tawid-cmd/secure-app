const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// 🔐 protect admin page
if (!token || role !== "admin") {
  alert("Access denied");
  location.href = "index.html";
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}

function addStudent() {

  if (!id.value || !name.value) {
    alert("Fill all fields!");
    return;
  }

  fetch("/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      id: id.value,
      name: name.value,
      math: +math.value,
      eng: +eng.value,
      sci: +sci.value,
      prog: +prog.value
    })
  }).then(load);
}

function load() {
  fetch("/students", {
    headers: { Authorization: token }
  })
  .then(res => {
    if (res.status === 401) location.href = "index.html";
    return res.json();
  })
  .then(data => {
    table.innerHTML = data.map(s => `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.total}</td>
        <td>${s.grade}</td>
      </tr>
    `).join("");
  });
}

load();
let students = [];

function load() {
  fetch("/students", {
    headers: { Authorization: token }
  })
  .then(res => res.json())
  .then(data => {
    students = data;
    render(data);
  });
}

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

function searchStudent() {
  const value = search.value.toLowerCase();

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(value)
  );

  render(filtered);
}