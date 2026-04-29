const token = localStorage.getItem("token");

// 🔐 যদি token না থাকে → login page এ পাঠাও
if (!token) {
  window.location.href = "index.html";
}

// logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// student load (view only)
function loadStudents() {
  fetch("/students", {
    headers: {
      "Authorization": token
    }
  })
  .then(res => {
    if (res.status === 401) {
      window.location.href = "index.html";
    }
    return res.json();
  })
  .then(data => {
    let html = "";

    data.forEach(s => {
      html += `<tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.total}</td>
        <td>${s.grade || "-"}</td>
      </tr>`;
    });

    document.getElementById("table").innerHTML = html;
  });
}

// run on load
loadStudents();