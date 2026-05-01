function login(){
  fetch("/login",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ username:username.value, password:password.value })
  })
  .then(r=>r.json())
  .then(d=>{
    if(!d.success) return alert("Login failed");
    localStorage.setItem("token",d.token);
    localStorage.setItem("role",d.role);
    location.href = d.role==="admin"?"admin.html":"user.html";
  });
}

if(localStorage.getItem("token")){
  const r=localStorage.getItem("role");
  location.href=r==="admin"?"admin.html":"user.html";
}

function togglePassword() {
  const password = document.getElementById("password");

  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}