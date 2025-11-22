// ====== Scrollytelling-logikk ======

// Hjelpefunksjon: finn neste seksjon etter hero
function getFirstStorySection() {
  return document.querySelector(".story-section");
}

// Scroll-knapp i hero
const scrollTriggerButton = document.querySelector(".scroll-trigger");
if (scrollTriggerButton) {
  scrollTriggerButton.addEventListener("click", () => {
    const targetSection = getFirstStorySection();
    if (!targetSection) return;

    const offset = 80; // litt margin fra toppen
    const top =
      targetSection.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: "smooth"
    });
  });
}

// Scroll-fremdrift
const scrollProgress = document.getElementById("scroll-progress");

function updateScrollProgress() {
  if (!scrollProgress) return;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.value = percent;
}

window.addEventListener("scroll", updateScrollProgress);
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

// ====== Blur nav based on scroll position (improved version) ======

const nav = document.querySelector(".hero-nav");
const hero = document.querySelector(".hero");

function updateNavBlur() {
  

  const heroRect = hero.getBoundingClientRect();
  /*
  // Når vi fortsatt ser hero (dvs. toppen av hero er ikke langt over skjermen)
  if (heroRect.bottom > 0) {
    // Hvor mye av hero som gjenstår (0–1)
    const progress = 1.4 - heroRect.bottom / window.innerHeight;

    // Blur øker jevnt mellom 0 og 12px
    const blurValue = Math.max(0, Math.min(progress * 12, 12));

    nav.style.filter = `blur(${blurValue}px)`;
    nav.style.opacity = `${1 - progress * 0.4}`;
  } else {
    // Når hero er ferdig scrolla bort
    nav.style.filter = "blur(0px)";
    nav.style.opacity = "1";
  }
    */
}

window.addEventListener("scroll", updateNavBlur);
window.addEventListener("resize", updateNavBlur);
updateNavBlur();


// IntersectionObserver for kapittel-animasjoner og tema
const storySections = document.querySelectorAll(".story-section");
const navLinks = document.querySelectorAll(".hero-menu a");

const observerOptions = {
  root: null,
  threshold: 0.35
};

function setBodyThemeFromSection(section) {
  const theme = section.getAttribute("data-theme");
  if (!theme) return;

  const body = document.body;
  // fjern gamle theme-klasser
  body.classList.forEach((cls) => {
    if (cls.startsWith("theme-")) {
      body.classList.remove(cls);
    }
  });
  body.classList.add(`theme-${theme.trim()}`);
}

function highlightNavForSection(section) {
  const id = section.id;
  if (!id) return;

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const matches = href === `#${id}`;
    link.classList.toggle("is-active", matches);
  });
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const section = entry.target;

      // aktiver animasjon
      section.classList.add("is-active");

      // endre stemning / bakgrunn
      setBodyThemeFromSection(section);

      // oppdater aktiv lenke i menyen
      highlightNavForSection(section);
    }
  });
}, observerOptions);

storySections.forEach((section) => {
  sectionObserver.observe(section);
});

// Initialt tema og nav-markering for seksjon som er synlig ved last
const firstVisible = Array.from(storySections).find((section) => {
  const rect = section.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
});
if (firstVisible) {
  setBodyThemeFromSection(firstVisible);
  highlightNavForSection(firstVisible);
}

// Liten parallax-effekt på hero-bildet (respekterer redusert bevegelse)
const heroImage = document.querySelector(".hero-figure img");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

window.addEventListener("scroll", () => {
  if (!heroImage) return;
  if (prefersReducedMotion.matches) return;

  const scrollY = window.scrollY || window.pageYOffset;
  const translate = Math.min(scrollY * 0.08, 40); // begrens hvor mye bildet flytter seg
  heroImage.style.transform = `translateY(${translate}px) scale(1.02)`;
});
