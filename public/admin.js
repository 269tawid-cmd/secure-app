const token = localStorage.getItem("token");

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
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
  })
  .then(() => load());
}

function load() {
  fetch("/students", {
    headers: { Authorization: token }
  })
  .then(res => res.json())
  .then(data => {
    let html = "";
    data.forEach(s => {
      html += `<tr>
        <td>${s.name}</td>
        <td>${s.total}</td>
      </tr>`;
    });
    table.innerHTML = html;
  });
}

load();