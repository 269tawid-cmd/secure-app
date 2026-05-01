function login(){
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  if(!username.value || !password.value){
    return alert("Fill all fields");
  }

  fetch("/login",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  .then(r=>r.json())
  .then(d=>{
    if(!d.success){
      alert("Login failed");
      return;
    }

    localStorage.setItem("token",d.token);
    localStorage.setItem("role",d.role);

    location.href = d.role==="admin"
      ? "admin.html"
      : "user.html";
  })
  .catch(()=>{
    alert("Server error");
  });
}


// already logged in হলে redirect
if(localStorage.getItem("token")){
  const r = localStorage.getItem("role");
  location.href = r==="admin"
    ? "admin.html"
    : "user.html";
}


// password show/hide
function togglePassword() {
  const password = document.getElementById("password");

  password.type =
    password.type === "password" ? "text" : "password";
}