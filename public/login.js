function login() {
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
    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role); // 🔥 new

      redirectUser();
    } else alert("Login failed");
  });
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