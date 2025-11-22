document.addEventListener("DOMContentLoaded", () => {
  const chapters = Array.from(document.querySelectorAll(".chapter"));
  const progressFill = document.querySelector(".scroll-progress__fill");
  const heroCta = document.querySelector(".hero-cta");
  const balanceRange = document.getElementById("balance-range");
  const balanceOutput = document.getElementById("balance-output");

  /* Hero-knapp: smooth scroll til første kapittel */
  if (heroCta) {
    heroCta.addEventListener("click", () => {
      const targetSelector = heroCta.getAttribute("data-scroll-target");
      const target = targetSelector ? document.querySelector(targetSelector) : null;
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  /* Interaktiv tekst for balanse-slider */
  function updateBalanceOutput(value) {
    const v = Number(value);
    let text;

    if (v <= 15) {
      text = "Hverdagen føles nesten bare som press – pauser er sjeldne og korte.";
    } else if (v <= 35) {
      text = "Akkurat nå trekker presset litt mer enn pusterommet.";
    } else if (v <= 60) {
      text = "Det finnes noen rom for tilflukt, men presset ligger fortsatt i bakgrunnen.";
    } else if (v <= 85) {
      text = "Tilflukten fyller mye – kanskje så mye at virkeligheten er lett å utsette.";
    } else if (v <= 100){
      text = "Nesten all energi går til å være i tilflukten. Virkeligheten blir stående på pause.";
    }

    if (balanceOutput) {
      balanceOutput.textContent = text;
    }
  }

  if (balanceRange) {
    updateBalanceOutput(balanceRange.value);
    balanceRange.addEventListener("input", (event) => {
      updateBalanceOutput(event.target.value);
    });
  }

  /* IntersectionObserver: scrollytelling-effekt og temafarger */

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target;
          if (entry.isIntersecting) {
            section.classList.add("is-visible");

            const theme = section.getAttribute("data-theme");
            if (theme) {
              document.body.setAttribute("data-theme", theme);
            }
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    chapters.forEach((section) => observer.observe(section));
  } else {
    // Fallback: vis alt hvis IntersectionObserver ikke støttes
    chapters.forEach((section) => section.classList.add("is-visible"));
  }

  /* Scrollprogresjon */

  let ticking = false;

  function updateScrollProgress() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressFill) {
      progressFill.style.width = progress.toFixed(1) + "%";
    }
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  });

  // Init progress ved start
  updateScrollProgress();
});
