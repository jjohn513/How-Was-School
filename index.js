const hamburgerIcon = document.querySelector(".hamburger--container")
const navbar = document.querySelector(".navbar")

hamburgerIcon.addEventListener("click", function(){
    navbar.classList.toggle("change")
    document.getElementById("overlay").style.display = "block";
})

  function off() {
    document.getElementById("overlay").style.display = "none";
  }