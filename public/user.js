const token = localStorage.getItem("token");

if (!token) location.href = "index.html";

function logout() {
  localStorage.removeItem("token");
  location.href = "index.html";
}

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