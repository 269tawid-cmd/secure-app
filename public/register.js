function register(){
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  if(!username || !password){
    shakeForm();
    return alert("Fill all fields");
  }

  if(password !== confirm){
    shakeForm();
    return alert("Password not match");
  }

  if(!isStrongPassword(password)){
    shakeForm();
    return alert("Password weak (Use capital + number)");
  }

  setLoading(true);

  fetch("/register",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ username, password })
  })
  .then(res=>res.json())
  .then(data=>{
    setLoading(false);

    if(data.success){
      alert("Registered সফল ✅");
      location.href = "index.html";
    }else{
      shakeForm();
      alert("User already exists");
    }
  })
  .catch(()=>{
    setLoading(false);
    shakeForm();
    alert("Server error");
  });
}

function togglePassword(id){
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

function setLoading(state){
  const btn = document.getElementById("regBtn");
  btn.innerText = state ? "Loading..." : "Register";
  btn.disabled = state;
}

function shakeForm(){
  const box = document.querySelector(".register-box");
  box.classList.add("shake");
  setTimeout(()=>box.classList.remove("shake"),300);
}

function isStrongPassword(pw){
  return pw.length >= 6 &&
         /[A-Z]/.test(pw) &&
         /[0-9]/.test(pw);
}