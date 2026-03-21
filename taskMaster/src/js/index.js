const login = document.querySelector("#login");
const recoverPassword = document.getElementById('recover');
const createAccount = document.getElementById('create');

login.addEventListener("click", (e) =>{
    e.preventDefault();
    window.location.href = "account.html";
})
 recoverPassword.addEventListener("click", (e) =>{
    e.preventDefault();
    window.location.href = "password.html";
 })
 createAccount.addEventListener("click", (e) =>{
    e.preventDefault();
    window.location.href = "register.html";
 })
    