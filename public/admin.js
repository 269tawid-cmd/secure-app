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

  box.innerHTML = SUBJECTS.map(s =>
    `<input id="${s}" placeholder="${s.toUpperCase()}">`
  ).join("");
}

// add subject
function addSubject(){
  const name = prompt("Subject name?");
  if(!name) return;

  SUBJECTS.push(name.toLowerCase());
  renderSubjects();
}

function addStudent(){
  const id = document.getElementById("id").value.trim();
  const name = document.getElementById("name").value.trim();

  // ✅ validation
  if(!id || !name){
    return alert("ID & Name required");
  }

  let subjects = {};

  for(let s of SUBJECTS){
    const val = +document.getElementById(s).value || 0;

    // ❌ mark validation
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
    body:JSON.stringify({ id, name, subjects })
  })
  .then(async r=>{
    const data = await r.json();

    // ❌ server error (401, 500)
    if(!r.ok){
      throw new Error(data.error || "Server error");
    }

    return data;
  })
  .then(d=>{
    if(d.success){
      alert("Added ✅");
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

  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Total</th>
      <th>Grade</th>
    </tr>
  ` + data.map(s=>`
    <tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.total}</td>
      <td><span class="badge">${s.grade}</span></td>
    </tr>
  `).join("");
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