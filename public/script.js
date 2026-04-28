let students = JSON.parse(localStorage.getItem("students")) || [];

// LOGIN
function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById("loginBox").style.display = "none";
      document.getElementById("app").style.display = "block";
    } else {
      alert("Login failed!");
    }
  });
}

// LOGOUT
function logout() {
  location.reload();
}

// ADD STUDENT
function addStudent() {
  let id = document.getElementById("id").value;
  let name = document.getElementById("name").value;
  let math = parseInt(document.getElementById("math").value);
  let eng = parseInt(document.getElementById("eng").value);
  let sci = parseInt(document.getElementById("sci").value);
  let prog = parseInt(document.getElementById("prog").value);

  // validation
  if (!id || !name || isNaN(math) || isNaN(eng) || isNaN(sci) || isNaN(prog)) {
    alert("Fill all fields!");
    return;
    localStorage.setItem("students", JSON.stringify(students));
  }

  // duplicate ID block
  let exists = students.some(s => s.id === id);
  if (exists) {
    alert("Duplicate ID!");
    return;
  }

  // calculation
  let total = math + eng + sci + prog;
  let avg = total / 4;

  let grade = avg >= 80 ? "A+" :
              avg >= 70 ? "A" :
              avg >= 60 ? "A-" :
              avg >= 50 ? "B" :
              avg >= 40 ? "C" : "F";

  let student = {
    id,
    name,
    math,
    eng,
    sci,
    prog,
    total,
    grade
  };

  students.push(student);
  displayStudents();
}

// DISPLAY TABLE
function displayStudents() {
  let table = document.getElementById("tableBody");

  let rows = "";

  students.forEach(s => {
    rows += `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.math}</td>
        <td>${s.eng}</td>
        <td>${s.sci}</td>
        <td>${s.prog}</td>
        <td>${s.total}</td>
        <td>${s.grade}</td>
      </tr>
    `;
  });

  table.innerHTML = rows;

  updateDashboard();
}

// DASHBOARD UPDATE
function updateDashboard() {
  let total = students.length;

  let sum = students.reduce((acc, s) => acc + s.total, 0);
  let avg = total ? (sum / total).toFixed(1) : 0;

  let pass = students.filter(s => s.grade !== "F").length;
  let fail = students.filter(s => s.grade === "F").length;

  document.getElementById("total").innerText = total;
  document.getElementById("avg").innerText = avg;
  document.getElementById("pass").innerText = pass;
  document.getElementById("fail").innerText = fail;
}
function searchStudent() {
  let q = document.getElementById("search").value.toLowerCase();
  if (q === "") {
  displayStudents();
  return;
  }

  let filtered = students.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.id.toLowerCase().includes(q)
  );

  displayFiltered(filtered);
}
function displayFiltered(list) {
  let table = document.getElementById("tableBody");

  let rows = "";

  list.forEach(s => {
    rows += `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.math}</td>
        <td>${s.eng}</td>
        <td>${s.sci}</td>
        <td>${s.prog}</td>
        <td>${s.total}</td>
        <td>${s.grade}</td>
      </tr>
    `;
  });

  table.innerHTML = rows;
}
window.onload = function () {
  displayStudents();
};