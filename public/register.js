function register() {
  fetch("/register", {
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
      alert("Account created!");
      window.location.href = "index.html";
    } else {
      alert(data.message || "Error");
    }
  });
}