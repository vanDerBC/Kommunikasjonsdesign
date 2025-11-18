// Lesefremdrift i progress-bar
(function () {
  const progress = document.querySelector(".reading-progress");

  function updateProgress() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progress) {
      progress.value = value;
    }
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
})();

// Scrollytelling: aktivt kapittel + tema + kapittelnavn
(function () {
  const chapters = document.querySelectorAll(".chapter");
  const root = document.documentElement;
  const chapterLabel = document.querySelector("[data-current-chapter]");

  if (!("IntersectionObserver" in window) || !chapters.length) {
    chapters.forEach((ch) => ch.classList.add("active"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        chapters.forEach((ch) => ch.classList.remove("active"));

        const target = entry.target;
        target.classList.add("active");

        const theme = target.getAttribute("data-theme");
        if (theme) {
          root.setAttribute("data-theme", theme);
        }

        const label = target.getAttribute("data-chapter-label");
        if (chapterLabel && label) {
          chapterLabel.textContent = label;
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  chapters.forEach((ch) => observer.observe(ch));
})();

// Til toppen-knapp
(function () {
  const button = document.querySelector(".back-to-top");
  if (!button) return;

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
})();

// Parallax-effekt på bilder i kapittelseksjonene
(function () {
  const images = document.querySelectorAll(".chapter-figure img, .hero-figure img");

  function handleParallax() {
    const viewportHeight = window.innerHeight;

    images.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const imgCenter = rect.top + rect.height / 2;

      // Avstand fra midten av skjermen (justerer parallax-styrke)
      const distanceFromCenter = imgCenter - viewportHeight / 2;

      // Parallax-faktor (jo lavere tall, jo mer subtil effekt)
      const parallax = distanceFromCenter * -0.05;

      img.style.transform = `translateY(${parallax}px) scale(1.06)`;
    });
  }

  window.addEventListener("scroll", handleParallax, { passive: true });
  window.addEventListener("resize", handleParallax);

  handleParallax();
})();
