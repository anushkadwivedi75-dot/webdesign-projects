// Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Dark/Light mode toggle
const toggleBtn = document.getElementById("mode-toggle");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")) {
      toggleBtn.textContent = "☀️ Light Mode";
    } else {
      toggleBtn.textContent = "🌙 Dark Mode";
    }
  });
}

// Reveal on scroll
function reveal() {
  let elements = document.querySelectorAll(".reveal");
  for (let i = 0; i < elements.length; i++) {
    let windowHeight = window.innerHeight;
    let elementTop = elements[i].getBoundingClientRect().top;
    let elementVisible = 100;

    if (elementTop < windowHeight - elementVisible) {
      elements[i].classList.add("active");
    } else {
      elements[i].classList.remove("active");
    }
  }
}


window.addEventListener("scroll", reveal);
reveal(); // run once on load
