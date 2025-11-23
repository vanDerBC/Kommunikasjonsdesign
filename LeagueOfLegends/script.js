/* --- SCROLL ANIMASJONER FOR ARTIKLER OG BILDER --- */
const animatedElements = document.querySelectorAll('article, .image-break');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

animatedElements.forEach(el => observer.observe(el));


/* --- TIDSLINJE NODER OG SCROLL-AKTIVERT ANIMASJON --- */

// Alle node-elementene
const nodes = document.querySelectorAll('.timeline-graph .node');

// Selve linjen/timeline-wrapper
const timeline = document.querySelector('.timeline-graph');

// Instruksjonsteksten over grafen
const timelineText = document.querySelector('.timeline-instruks');

// Plasser nodene jevnt og lag tooltips
nodes.forEach((node, index) => {
  const total = nodes.length - 1;
  const position = (index / total) * 100;

  node.style.left = position + '%';

  // Lag tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = node.dataset.year + ": " + node.dataset.text;

  node.appendChild(tooltip);
});

const fotoTekster = document.querySelectorAll('.foto-tekst');

const fotoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

fotoTekster.forEach(f => fotoObserver.observe(f));



/* --- OBSERVER SOM STARTER TIMELINE-ANIMASJONEN --- */
const timelineObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {

      /* 1: Fade inn instruksjonen */
      if (timelineText) {
        timelineText.classList.add('visible');
      }

      /* 2: Start linjeanimasjon */
      timeline.classList.add('animate');

      /* 3: Nodeanimasjoner i sekvens */
      nodes.forEach((node, index) => {
        setTimeout(() => {
          node.classList.add('animate');
        }, index * 400); // En node hvert 0.4 sekund
      });

      // Stopper observer etter første aktivering
      timelineObserver.unobserve(timeline);
    }
  });
}, { threshold: 0.3 });

timelineObserver.observe(timeline);

/* --- GENERER FLERE RUNER AUTOMATISK --- */
const runeImages = [
  "Images/precision.png",
  "Images/domination.png",
  "Images/sorcery.png",
  "Images/resolve.png",
  "Images/inspiration.png"
];

const runeContainer = document.getElementById("rune-container");

function createRune() {
  const rune = document.createElement("div");
  rune.classList.add("rune");

  // Tilfeldig runeikon
  rune.style.backgroundImage = `url(${runeImages[Math.floor(Math.random() * runeImages.length)]})`;

  // Tilfeldig størrelse (mer variasjon)
  const size = Math.floor(Math.random() * 80) + 60; // 60–140px
  rune.style.width = `${size}px`;
  rune.style.height = `${size}px`;

  // Bredere spredning over hele skjermen
  rune.style.top = `${Math.random() * 120 - 10}%`;   // kan gå litt utenfor toppen
  rune.style.left = `${Math.random() * 120 - 10}%`;  // kan gå litt utenfor venstre kant

  // Raskere animasjoner, mer variasjon
  rune.style.animationDuration = `${6 + Math.random() * 6}s`; // 6–12s

  // Sett inn i container
  runeContainer.appendChild(rune);
}


// Generer 18 runer
for (let i = 0; i < 30; i++) {
  createRune();
}

const backToTopBtn = document.getElementById("back-to-top");

// Vis knappen når man scroller ned
window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add("visible");
  } else {
    backToTopBtn.classList.remove("visible");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });

  setTimeout(() => {
    location.reload();
  }, 2000); // litt delay for smoothe scroll
});
