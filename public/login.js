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

      if (data.role === "admin") {
        location.href = "admin.html";
      } else {
        location.href = "user.html";
      }
    } else alert("Login failed");
  });
}