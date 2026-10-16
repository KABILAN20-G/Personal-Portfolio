"use strict";

/* ==================================================
   ELEMENTS
================================================== */

const loadingScreen = document.getElementById("loading-screen");
const welcomeScreen = document.getElementById("welcome-screen");
const portfolio = document.getElementById("portfolio");
const percentage = document.getElementById("percentage");

const enterButton = document.getElementById("enter-btn");
const typewriterOne = document.getElementById("typewriter-one");
const typewriterTwo = document.getElementById("typewriter-two");

const navToggle = document.getElementById("nav-menu-toggle");
const navLinksContainer = document.getElementById("nav-links");
const navLinks = document.querySelectorAll(".nav-link");

const backToTop = document.getElementById("back-to-top");
const mouseGlow = document.getElementById("mouse-glow");
const holographicCard = document.querySelector(".holographic-card");

/* ==================================================
   STATE
================================================== */

let portfolioOpened = false;
let portfolioInitialized = false;
let loadingProgress = 0;
let loadingInterval = null;

/* ==================================================
   INITIAL STATE
================================================== */

function initializeApplication() {
  if (portfolio) {
    portfolio.hidden = true;
    portfolio.classList.remove("portfolio-visible");
  }

  if (loadingScreen) {
    loadingScreen.style.display = "flex";
    loadingScreen.style.opacity = "1";
  }

  if (welcomeScreen) {
    welcomeScreen.style.display = "none";
    welcomeScreen.style.opacity = "0";
  }

  if (enterButton) {
    enterButton.style.display = "none";
    enterButton.classList.remove("show");
    enterButton.disabled = false;
  }

  document.body.style.overflow = "hidden";

  startLoading();
}

/* ==================================================
   LOADING SCREEN
================================================== */

function startLoading() {
  if (!loadingScreen || !welcomeScreen) {
    console.error(
      "Loading screen or welcome screen was not found. Check your HTML IDs.",
    );
    return;
  }

  if (loadingInterval !== null) {
    clearInterval(loadingInterval);
  }

  loadingProgress = 0;

  if (percentage) {
    percentage.textContent = "0";
  }

  loadingInterval = setInterval(() => {
    loadingProgress = Math.min(loadingProgress + 1, 100);

    if (percentage) {
      percentage.textContent = String(loadingProgress);
    }

    if (loadingProgress >= 100) {
      clearInterval(loadingInterval);
      loadingInterval = null;

      setTimeout(finishLoading, 450);
    }
  }, 30);
}

/* ==================================================
   FINISH LOADING
================================================== */

function finishLoading() {
  if (!loadingScreen || !welcomeScreen) {
    return;
  }

  loadingScreen.style.opacity = "0";

  setTimeout(() => {
    loadingScreen.style.display = "none";

    welcomeScreen.style.display = "flex";

    // Allow the browser to apply display:flex before fading in.
    requestAnimationFrame(() => {
      welcomeScreen.style.opacity = "1";
    });

    startWelcomeSequence();
  }, 800);
}

/* ==================================================
   WELCOME SCREEN SEQUENCE
================================================== */

function startWelcomeSequence() {
  if (!welcomeScreen || !typewriterOne || !typewriterTwo || !enterButton) {
    console.error("A welcome-screen element is missing. Check the HTML IDs.");
    return;
  }

  // Reset the welcome elements.
  typewriterOne.style.display = "none";
  typewriterTwo.style.display = "none";

  enterButton.style.display = "none";
  enterButton.classList.remove("show");
  enterButton.disabled = false;

  // Show the first typewriter line.
  setTimeout(() => {
    if (portfolioOpened) return;
    typewriterOne.style.display = "flex";
  }, 500);

  // Show the second typewriter line.
  setTimeout(() => {
    if (portfolioOpened) return;
    typewriterTwo.style.display = "flex";
  }, 3500);

  // Reveal the Enter Portfolio button.
  setTimeout(() => {
    if (portfolioOpened) return;

    enterButton.style.display = "inline-block";

    requestAnimationFrame(() => {
      enterButton.classList.add("show");
    });
  }, 7500);
}

/* ==================================================
   ENTER PORTFOLIO
================================================== */

function enterPortfolio() {
  // Prevent duplicate clicks.
  if (portfolioOpened) {
    return;
  }

  // Verify the required elements exist.
  if (!welcomeScreen || !portfolio) {
    console.error("Welcome screen or portfolio element was not found.");
    return;
  }

  portfolioOpened = true;

  if (enterButton) {
    enterButton.disabled = true;
  }

  // Fade out the welcome screen.
  welcomeScreen.style.opacity = "0";

  setTimeout(() => {
    welcomeScreen.style.display = "none";

    // Reveal the portfolio.
    portfolio.hidden = false;

    // Force a browser layout update before the animation.
    void portfolio.offsetHeight;

    portfolio.classList.add("portfolio-visible");

    // Enable scrolling.
    document.body.style.overflow = "auto";
    document.body.style.overflowX = "hidden";

    // Start at the top of the portfolio.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    // Initialize portfolio interactions.
    initializePortfolio();
  }, 800);
}

/* ==================================================
   ENTER BUTTON EVENTS
================================================== */

if (enterButton) {
  // Mouse click event
  enterButton.addEventListener("click", enterPortfolio);

  // Global keyboard accessibility: Trigger on pressing 'Enter' key
  document.addEventListener("keydown", (event) => {
    // Check if Enter was pressed, portfolio isn't open yet,
    // and the welcome screen / enter button are currently visible
    if (event.key === "Enter" && !portfolioOpened) {
      // Ensure the welcome screen is active/visible before triggering
      if (
        welcomeScreen &&
        window.getComputedStyle(welcomeScreen).display !== "none"
      ) {
        event.preventDefault();
        enterPortfolio();
      }
    }
  });
} else {
  console.error('Element with ID "enter-btn" was not found.');
}




/* ==================================================
   PORTFOLIO INITIALIZATION
================================================== */

function initializePortfolio() {
  if (portfolioInitialized) {
    return;
  }

  portfolioInitialized = true;

  initializeRevealAnimations();
  initializeMobileNavigation();
  initializeBackToTop();
  initializeActiveNavigation();
  initializeMouseGlow();
  initializeHolographicCard();
  initializePlaceholderLinks();
}

/* ==================================================
   SCROLL REVEAL ANIMATIONS
================================================== */

function initializeRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) {
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Respect the user's reduced-motion preference.
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

/* ==================================================
   MOBILE NAVIGATION
================================================== */

function initializeMobileNavigation() {
  if (!navToggle || !navLinksContainer) {
    return;
  }

  navToggle.setAttribute("aria-expanded", "false");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinksContainer.classList.toggle("open");

    navToggle.classList.toggle("open", isOpen);

    navToggle.setAttribute("aria-expanded", String(isOpen));

    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
  });

  // Close the mobile menu after selecting a navigation link.
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileNavigation);
  });

  // Close the mobile menu with Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileNavigation();
    }
  });

  // Close the menu if the viewport changes to desktop size.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 850) {
      closeMobileNavigation();
    }
  });
}

/* ==================================================
   CLOSE MOBILE NAVIGATION
================================================== */

function closeMobileNavigation() {
  if (!navToggle || !navLinksContainer) {
    return;
  }

  navLinksContainer.classList.remove("open");
  navToggle.classList.remove("open");

  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
}

/* ==================================================
   BACK TO TOP BUTTON
================================================== */

function initializeBackToTop() {
  if (!backToTop) {
    return;
  }

  function updateBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  window.addEventListener("scroll", updateBackToTop, {
    passive: true,
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  });

  updateBackToTop();
}

/* ==================================================
   ACTIVE NAVIGATION
================================================== */

function initializeActiveNavigation() {
  const sections = document.querySelectorAll("#portfolio section[id]");

  if (!sections.length || !navLinks.length) {
    return;
  }

  setActiveNavigation("about");

  if (!("IntersectionObserver" in window)) {
    return;
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (!visibleEntries.length) {
        return;
      }

      visibleEntries.sort((a, b) => {
        const targetY = window.innerHeight * 0.35;

        const distanceA = Math.abs(
          a.target.getBoundingClientRect().top - targetY,
        );

        const distanceB = Math.abs(
          b.target.getBoundingClientRect().top - targetY,
        );

        return distanceA - distanceB;
      });

      setActiveNavigation(visibleEntries[0].target.id);
    },
    {
      rootMargin: "-20% 0px -55% 0px",
      threshold: 0,
    },
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("href");

      if (target && target.startsWith("#")) {
        setActiveNavigation(target.substring(1));
      }
    });
  });
}

/* ==================================================
   SET ACTIVE NAVIGATION
================================================== */

function setActiveNavigation(sectionId) {
  navLinks.forEach((link) => {
    const target = link.getAttribute("href");

    link.classList.toggle("active", target === `#${sectionId}`);
  });
}

/* ==================================================
   MOUSE GLOW
================================================== */

function initializeMouseGlow() {
  if (!mouseGlow) {
    return;
  }

  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  if (isTouchDevice) {
    mouseGlow.style.display = "none";
    return;
  }

  document.addEventListener("mousemove", (event) => {
    mouseGlow.style.left = `${event.clientX}px`;
    mouseGlow.style.top = `${event.clientY}px`;
    mouseGlow.style.opacity = "1";
  });

  document.addEventListener("mouseleave", () => {
    mouseGlow.style.opacity = "0";
  });
}

/* ==================================================
   HOLOGRAPHIC CARD
================================================== */

function initializeHolographicCard() {
  if (!holographicCard) {
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  if (reducedMotion || isTouchDevice) {
    return;
  }

  holographicCard.addEventListener("mousemove", (event) => {
    const rect = holographicCard.getBoundingClientRect();

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    if (!centerX || !centerY) {
      return;
    }

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    holographicCard.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-4px)
        `;
  });

  holographicCard.addEventListener("mouseleave", () => {
    holographicCard.style.transform = `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            translateY(0)
        `;
  });
}

/* ==================================================
   PLACEHOLDER LINKS
================================================== */

function initializePlaceholderLinks() {
  const placeholders = document.querySelectorAll(".placeholder-link");

  placeholders.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.getAttribute("href") === "#") {
        event.preventDefault();
      }
    });
  });
}

/* ==================================================
   START APPLICATION
================================================== */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApplication, {
    once: true,
  });
} else {
  initializeApplication();
}

// ==================================================
// PURE JAVASCRIPT 3D CARD SLIDER
// ==================================================
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide-3d');
    const prevBtn = document.getElementById('cert-prev');
    const nextBtn = document.getElementById('cert-next');

    if (!slides.length) return;

    let currentIndex = 0;

    function updateSlider() {
        slides.forEach((slide, index) => {
            // Clear prior positioning classes
            slide.className = 'slide-3d';

            if (index === currentIndex) {
                slide.classList.add('active');
            } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
                slide.classList.add('prev');
            } else if (index === (currentIndex + 1) % slides.length) {
                slide.classList.add('next');
            } else if (index < currentIndex) {
                slide.classList.add('far-prev');
            } else {
                slide.classList.add('far-next');
            }
        });
    }

    // Event Listeners for Navigation Buttons
    nextBtn?.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    });

    prevBtn?.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    });

    // Optional: Allow clicking side images directly to bring them forward
    slides.forEach((slide, index) => {
        slide.addEventListener('click', (e) => {
            if (index !== currentIndex) {
                e.preventDefault(); // Don't follow link unless it's the active front slide
                currentIndex = index;
                updateSlider();
            }
        });
    });

    // Initialize initial state
    updateSlider();
});