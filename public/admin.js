// 🔐 auth guard
const token = localStorage.getItem("token");
if(!token){
  location.href = "index.html";
}

// subjects
let SUBJECTS = ["math","eng","sci","prog"];
let students = [];

// render subject inputs
function renderSubjects(){
  const box = document.getElementById("subjects-box");

  box.innerHTML = SUBJECTS.map(s => `
    <div class="input-group">
      <label>${s.toUpperCase()}</label>
      <input type="number" id="${s}" placeholder="0-100" min="0" max="100">
    </div>
  `).join("");
}

// ... existing code ...

// render table
function render(data){
  const table = document.getElementById("table");

  if (data.length === 0) {
    table.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 3rem;">No student records found.</td></tr>`;
    return;
  }

  table.innerHTML = data.map(s=>`
    <tr>
      <td style="font-weight: 600; color: var(--accent-color);">${s.id}</td>
      <td style="font-weight: 500;">${s.name}</td>
      <td>
        <div style="font-size: 0.75rem; color: var(--text-secondary);">
          ${Object.entries(s.subjects || {}).map(([name, score]) => `${name}: ${score}`).join(" | ")}
        </div>
      </td>
      <td style="font-weight: 600;">${s.total}</td>
      <td>
        <span style="
          padding: 4px 12px; 
          border-radius: 999px; 
          font-size: 0.75rem; 
          font-weight: 700;
          background: ${s.grade === 'F' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'};
          color: ${s.grade === 'F' ? '#ef4444' : '#10b981'};
          border: 1px solid ${s.grade === 'F' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'};
        ">
          ${s.grade}
        </span>
      </td>
      <td>
        <button onclick="deleteStudent('${s.id}')" class="btn btn-ghost" style="padding: 6px; color: var(--danger-color); border-color: transparent;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </td>
    </tr>
  `).join("");
}

function deleteStudent(id) {
  if(!confirm("Are you sure you want to delete this student?")) return;

  fetch(`/delete/${id}`, {
    method: "DELETE",
    headers: { "Authorization": token }
  })
  .then(r => r.json())
  .then(d => {
    if(d.success) {
      load();
    } else {
      alert("Delete failed");
    }
  });
}

// logout
function logout(){
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  location.href = "index.html";
}

// init
renderSubjects();
load();

const grades = ["A+", "A", "B", "F"];
const container = document.getElementById("grades");

for(let i = 0; i < 40; i++){  // 👈 number change করতে পারিস
  const span = document.createElement("span");

  const g = grades[Math.floor(Math.random() * grades.length)];
  span.innerText = g;

  // random position
  span.style.left = Math.random() * 100 + "%";

  // random delay
  span.style.animationDelay = Math.random() * 10 + "s";

  // random size
  span.style.fontSize = (14 + Math.random() * 20) + "px";

  // color assign
  if(g === "A+") span.className = "grade-ap";
  else if(g === "A") span.className = "grade-a";
  else if(g === "B") span.className = "grade-b";
  else span.className = "grade-f";

  container.appendChild(span);
}
 /* only 10 */