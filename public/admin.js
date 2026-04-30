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
let currentEditId = null;

// ➕ ADD
function addStudent() {
  const idInput = document.getElementById("id");
  const nameInput = document.getElementById("name");
  const mathInput = document.getElementById("math");
  const engInput = document.getElementById("eng");
  const sciInput = document.getElementById("sci");
  const progInput = document.getElementById("prog");

  const idVal = idInput.value.trim();
  const nameVal = nameInput.value.trim();
  const mathVal = mathInput.value;
  const engVal = engInput.value;
  const sciVal = sciInput.value;
  const progVal = progInput.value;

  // 🔍 validation
  if (!idVal || !nameVal || !mathVal || !engVal || !sciVal || !progVal) {
    alert("Fill all fields!");
    idInput.focus();
    return;
  }

  fetch("/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      id: idVal,
      name: nameVal,
      math: +mathVal,
      eng: +engVal,
      sci: +sciVal,
      prog: +progVal
    })
  })
  .then(() => {
    clearForm();
    load();
    idInput.focus(); // 🔥 focus
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
      <td>${s.math}</td>
      <td>${s.eng}</td>
      <td>${s.sci}</td>
      <td>${s.prog}</td>
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

// ✏️ EDIT
function editStudent(id) {
  const s = students.find(x => x.id == id);

  document.getElementById("id").value = s.id;
  document.getElementById("name").value = s.name;
  document.getElementById("math").value = s.math;
  document.getElementById("eng").value = s.eng;
  document.getElementById("sci").value = s.sci;
  document.getElementById("prog").value = s.prog;

  currentEditId = id;
}

// 💾 UPDATE
function updateStudent() {
  if (!currentEditId) {
    alert("Select student first!");
    return;
  }

  const idVal = document.getElementById("id").value;
  const nameVal = document.getElementById("name").value;
  const mathVal = document.getElementById("math").value;
  const engVal = document.getElementById("eng").value;
  const sciVal = document.getElementById("sci").value;
  const progVal = document.getElementById("prog").value;

  fetch("/update/" + currentEditId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      id: idVal,
      name: nameVal,
      math: +mathVal,
      eng: +engVal,
      sci: +sciVal,
      prog: +progVal
    })
  })
  .then(() => {
    currentEditId = null;
    clearForm();
    load();
  });
}

// 🧹 CLEAR
function clearForm() {
  document.getElementById("id").value = "";
  document.getElementById("name").value = "";
  document.getElementById("math").value = "";
  document.getElementById("eng").value = "";
  document.getElementById("sci").value = "";
  document.getElementById("prog").value = "";
}

// 🔍 SEARCH
function searchStudent() {
  const val = document.getElementById("search").value.toLowerCase();

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(val)
  );

  render(filtered);
}

load();

// 🔥 ENTER KEY SUPPORT
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // ❌ page reload বন্ধ

    // যদি edit mode থাকে → update
    if (currentEditId) {
      updateStudent();
    } else {
      addStudent();
    }
  }
});