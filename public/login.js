function login() {
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: document.getElementById("username").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem("token", data.token);

      if (data.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "user.html";
      }
    } else {
      alert("Login failed");
    }
  });
}