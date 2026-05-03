// 🔐 auth guard
const token = localStorage.getItem("token");
if(!token){
  location.href = "login.html";
}

let currentSubjects = []; // This will store the list of subjects added by the admin
let students = [];

// Function to add a new subject field dynamically
function addSubject(){
  const name = prompt("Enter Subject Name (e.g., Quran, Math, Fiqh):");
  if(!name) return;

  const subjectName = name.trim();
  if(currentSubjects.includes(subjectName)) {
    return alert("Subject already added!");
  }

  currentSubjects.push(subjectName);
  renderSubjects();
}

// Function to clear subjects when class changes (optional, but keeps things clean)
function onClassChange() {
  currentSubjects = [];
  renderSubjects();
}

// Render the dynamically added subject inputs
function renderSubjects(){
  const box = document.getElementById("subjects-box");

  if (currentSubjects.length === 0) {
    box.innerHTML = `<p style="color: var(--text-secondary); font-size: 0.8rem;">No subjects added yet. Click 'Add Subject' to begin.</p>`;
    return;
  }

  box.innerHTML = currentSubjects.map(s => `
    <div class="input-group reveal">
      <label>${s.toUpperCase()}</label>
      <input type="number" id="sub-${s}" placeholder="0-100" min="0" max="100">
      <button onclick="removeSubject('${s}')" style="background: none; border: none; color: var(--danger-color); cursor: pointer; font-size: 0.7rem; margin-top: 5px;">Remove</button>
    </div>
  `).join("");
}

function removeSubject(name) {
  currentSubjects = currentSubjects.filter(s => s !== name);
  renderSubjects();
}

function addStudent(){
  const id = document.getElementById("id").value.trim();
  const name = document.getElementById("name").value.trim();
  const selectedClass = document.getElementById("class-select").value;

  if(!id || !name || !selectedClass){
    return alert("ID, Name & Class required");
  }

  if(currentSubjects.length === 0) {
    return alert("Please add at least one subject and score.");
  }

  let subjects = {};
  for(let s of currentSubjects){
    const val = +document.getElementById(`sub-${s}`).value || 0;

    if(val > 100){
      return alert(`${s.toUpperCase()} max 100`);
    }

    subjects[s] = val;
  }

  fetch("/add",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization": token
    },
    body:JSON.stringify({ id, name, class: selectedClass, subjects })
  })
  .then(async r=>{
    const data = await r.json();
    if(!r.ok){
      throw new Error(data.error || "Server error");
    }
    return data;
  })
  .then(d=>{
    if(d.success){
      alert("Student Record Saved ✅");
      // Reset form
      document.getElementById("id").value = "";
      document.getElementById("name").value = "";
      currentSubjects = [];
      renderSubjects();
      load();
    }else{
      alert(d.message || "Failed to add");
    }
  })
  .catch(err=>{
    alert(err.message || "Network error");
  });
}

// load students
function load(){
  fetch("/students",{
    headers:{ "Authorization": token }
  })
  .then(r=>r.json())
  .then(data=>{
    students = data;
    render(data);
  });
}

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
      <td style="font-weight: 500;">
        ${s.name}<br>
        <span class="madrasha-class-tag">${s.class}</span>
      </td>
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

function logout(){
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  location.href = "login.html";
}

// init
renderSubjects();
load();
