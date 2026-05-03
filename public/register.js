function register(){
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm-password").value;
  const btn = document.querySelector(".btn-primary");

  if(!username || !password){
    return alert("Please fill in all fields.");
  }

  if(password !== confirm){
    return alert("Passwords do not match.");
  }

  if(!isStrongPassword(password)){
    return alert("Password must be at least 6 characters and include a capital letter and a number.");
  }

  // Set loading state
  const originalText = btn.innerText;
  btn.innerText = "Creating Account...";
  btn.disabled = true;

  fetch("/register",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ username, password })
  })
  .then(res=>res.json())
  .then(data=>{
    btn.innerText = originalText;
    btn.disabled = false;

    if(data.success){
      alert("Registration successful! Please login.");
      location.href = "login.html";
    }else{
      alert(data.message || "User already exists.");
    }
  })
  .catch(()=>{
    btn.innerText = originalText;
    btn.disabled = false;
    alert("Server error. Please try again later.");
  });
}

function isStrongPassword(pw){
  return pw.length >= 6 &&
         /[A-Z]/.test(pw) &&
         /[0-9]/.test(pw);
}