const token = localStorage.getItem("token");

if (!token) location.href = "index.html";

function logout() {
  localStorage.removeItem("token");
  location.href = "index.html";
}

function addStudent() {
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
  .then(res => res.json())
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