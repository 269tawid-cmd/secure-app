function register() {
  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Account created!");
      location.href = "index.html";
    } else {
      alert(data.message);
    }
  });
}