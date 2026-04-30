const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "admin") location.href = "index.html";

const subjects = {};
SUBJECT_CONFIG.forEach(s=>{
  subjects[s.key] = +document.getElementById(s.key).value || 0;
});
let students = [], editId = null;

// 🔧 render subject inputs
function renderSubjects(){
  subjectsBox.innerHTML = SUBJECTS.map(s =>
    `<input id="${s}" type="number" min="0" max="100" placeholder="${s} (0-100)">`
  ).join("");
}
renderSubjects();

// ➕ ADD
function addStudent(){
  const idVal = id.value;
  const nameVal = name.value;

  let subjects = {};

  SUBJECTS.forEach(s=>{
    subjects[s] = +document.getElementById(s).value || 0;
  });

  fetch("/add",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":token
    },
    body:JSON.stringify({
      id:idVal,
      name:nameVal,
      subjects
    })
  })
  .then(res=>res.json())
  .then(()=>{
    clearForm();
    load();
  });
}

// ✏️ UPDATE
function updateStudent(){
  if(!editId) return alert("Select first");

  const subjects = {};
  for (let s of SUBJECTS){
    subjects[s]=+document.getElementById(s).value;
  }

  fetch("/update/"+editId,{
    method:"PUT",
    headers:{ "Content-Type":"application/json","Authorization":token },
    body:JSON.stringify({ id:id.value, name:name.value, subjects })
  }).then(()=>{ editId=null; load(); });
}

// 📥 LOAD
function load(){
  fetch("/students",{ headers:{Authorization:token}})
  .then(r=>r.json())
  .then(d=>{ students=d; render(d); });
}

// 🖥️ RENDER
function render(data){
  thead.innerHTML = `
    <tr>
      <th>ID</th><th>Name</th>
      ${SUBJECTS.map(s=>`<th>${s}</th>`).join("")}
      <th>Total</th><th>Grade</th><th>Action</th>
    </tr>
  `;

  table.innerHTML = data.map(s=>`
    <tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      ${SUBJECTS.map(k=>`<td>${s.subjects?.[k]||0}</td>`).join("")}
      <td>${s.total}</td>
      <td>${s.grade}</td>
      <td>
        <button onclick="edit('${s.id}')">Edit</button>
        <button onclick="del('${s.id}')">X</button>
      </td>
    </tr>
  `).join("");
}

// ❌ DELETE
function del(id){
  fetch("/delete/"+id,{method:"DELETE",headers:{Authorization:token}})
  .then(load);
}

// ✏️ EDIT
function edit(idVal){
  const s = students.find(x=>x.id==idVal);
  id.value=s.id; name.value=s.name;
  SUBJECTS.forEach(k=>document.getElementById(k).value=s.subjects?.[k]||0);
  editId=idVal;
}

function logout(){ localStorage.clear(); location.href="index.html"; }
function toggleTheme(){ document.body.classList.toggle("light"); }

load();
function clearForm(){
  id.value="";
  name.value="";
  SUBJECTS.forEach(s=>{
    document.getElementById(s).value="";
  });
}