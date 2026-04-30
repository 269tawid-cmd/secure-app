let SUBJECTS = ["math","eng","sci","prog"];

function renderSubjects(){
  const box = document.getElementById("subjects-box");

  if(!box) return; // safety

  box.innerHTML = SUBJECTS.map(s => `
    <input id="${s}" placeholder="${s.toUpperCase()}">
  `).join("");
}

function addSubject(){
  const name = prompt("Subject name?");
  if(!name) return;

  SUBJECTS.push(name.toLowerCase());
  renderSubjects();
}

// 🔥 VERY IMPORTANT
window.onload = renderSubjects;
const token = localStorage.getItem("token");
if(!token) location.href="index.html";

let SUBJECTS = ["math","eng","sci","prog"];
let students = [];

// render inputs
function renderSubjects(){
  subjectsBox.innerHTML = SUBJECTS.map(s=>
    `<input id="${s}" placeholder="${s.toUpperCase()}">`
  ).join("");
}

// add subject
function addSubject(){
  const name = prompt("Subject?");
  if(!name) return;

  SUBJECTS.push(name.toLowerCase());
  renderSubjects();
}

// add student
function addStudent(){
  let subjects={};

  SUBJECTS.forEach(s=>{
    subjects[s] = +document.getElementById(s).value || 0;
  });

  fetch("/add",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:token
    },
    body:JSON.stringify({
      id:id.value,
      name:name.value,
      subjects
    })
  }).then(()=>load());
}

// load
function load(){
  fetch("/students",{headers:{Authorization:token}})
  .then(r=>r.json())
  .then(d=>{
    students=d;
    render(d);
  });
}

// render table
function render(data){
  table.innerHTML = data.map(s=>`
    <tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.total}</td>
      <td>${s.grade}</td>
    </tr>
  `).join("");
}

renderSubjects();
load();