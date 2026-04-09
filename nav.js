const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () =>{
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}))

function handleSubscribe(e, form){
    e.preventDefault();
    form.querySelector('input').style.display = 'none';
    form.querySelector('button').style.display = 'none';
    form.querySelector('.sub-confirm').style.display = 'block';
}