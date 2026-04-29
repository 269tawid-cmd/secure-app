const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "admin") {
  alert("Access denied");
  location.href = "index.html";
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}

let students = [];

// ➕ ADD
function addStudent() {
  if (
  !document.getElementById("id").value ||
  !document.getElementById("name").value
) {
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
  }).then(() => {
    clearForm();
    load();
  });
}

// 🔄 LOAD
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

// 🖥️ RENDER
function render(data) {
  table.innerHTML = data.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.total}</td>
      <td>${s.grade}</td>
      <td>
        <button onclick="editStudent('${s.id}')">Edit</button>
        <button onclick="deleteStudent('${s.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

// ❌ DELETE
function deleteStudent(id) {
  if (!confirm("Delete this student?")) return;

  fetch("/delete/" + id, {
    method: "DELETE",
    headers: { Authorization: token }
  }).then(load);
}

// ✏️ EDIT (fill form)
function editStudent(id) {
  const s = students.find(x => x.id == id);

  document.getElementById("id").value = s.id;
  document.getElementById("name").value = s.name;
  document.getElementById("math").value = s.math;
  document.getElementById("eng").value = s.eng;
  document.getElementById("sci").value = s.sci;
  document.getElementById("prog").value = s.prog;

  window.currentEditId = id;
}

// 💾 UPDATE
function updateStudent() {
  fetch("/update/" + currentEditId, {
    method: "PUT",
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
  }).then(() => {
    currentEditId = null;
    clearForm();
    load();
  });
}

// 🧹 CLEAR
function clearForm() {
  id.value = "";
  name.value = "";
  math.value = "";
  eng.value = "";
  sci.value = "";
  prog.value = "";
}

// 🔍 SEARCH
function searchStudent() {
  const val = search.value.toLowerCase();

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(val)
  );

  render(filtered);
}

load();