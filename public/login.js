function login() {
  const btn = document.querySelector(".login-card button");

  btn.innerText = "Logging...";
  btn.classList.add("loading");

  fetch("/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  .then(res => res.json())
  .then(data => {

    btn.innerText = "Login";
    btn.classList.remove("loading");

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      location.href = data.role === "admin" ? "admin.html" : "user.html";
    } else {
      shake(); // 👇 error animation
    }
  });
}
function togglePassword() {
  const p = document.getElementById("password");
  p.type = p.type === "password" ? "text" : "password";
}

// 🔥 auto redirect
function redirectUser() {
  const role = localStorage.getItem("role");

  if (role === "admin") location.href = "admin.html";
  else location.href = "user.html";
}

// 🔥 auto login on load
if (localStorage.getItem("token")) {
  redirectUser();
}
function shake() {
  const card = document.querySelector(".login-card");
  card.classList.add("shake");

  setTimeout(() => {
    card.classList.remove("shake");
  }, 300);
}