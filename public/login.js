if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}
function login() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  if (user === "admin" && pass === "1234") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "index.html";
  } else {
    alert("Wrong login!");
  }
}
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}