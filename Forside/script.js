/* ================================
   PARTICLE BACKGROUND
================================= */

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createParticles() {
    particles = [];
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(drawParticles);
}

createParticles();
drawParticles();

/* ================================
   SHOW ARTICLES WHEN BUTTON IS CLICKED
================================= */

const showBtn = document.getElementById("showArticles");
const articleSection = document.getElementById("articleSection");

showBtn.addEventListener("click", () => {

    articleSection.classList.remove("hidden");

    window.location.hash = "#articles";

    // Smooth scroll
    setTimeout(() => {
        articleSection.scrollIntoView({ behavior: "smooth" });
    }, 200);
});

if (window.location.hash === "#articles") {
    articleSection.classList.remove("hidden");
}

const smallCards = document.querySelectorAll(".small-card");

const smallObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.2 });

smallCards.forEach(card => smallObserver.observe(card));
