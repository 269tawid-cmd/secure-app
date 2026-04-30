function register(){
  fetch("/register",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ username:username.value, password:password.value })
  })
  .then(r=>r.json())
  .then(d=>{
    if(d.success){ alert("Done"); location.href="index.html"; }
    else alert(d.message);
  });
}