const root = document.documentElement;
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const photoTrigger = document.getElementById("photoTrigger");
const photoModal = document.getElementById("photoModal");
const projectsGrid = document.getElementById("projectsGrid");
const projectsStatus = document.getElementById("projectsStatus");
const sectionLinks = document.querySelectorAll("[data-section-link]");
const sections = document.querySelectorAll("main section[id]");
const cursorAura = document.querySelector(".cursor-aura");
const cursorDot = document.querySelector(".cursor-dot");
const launchScreen = document.getElementById("launchScreen");
const skipIntro = document.getElementById("skipIntro");
const copyToast = document.getElementById("copyToast");

const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
let copyToastTimer = null;
let introHasExited = false;

body.classList.add("is-intro-active");

const setTheme = (theme) => {
  root.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
};

const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
};

const showCopyToast = (message) => {
  copyToast.textContent = message;
  copyToast.classList.add("is-visible");
  window.clearTimeout(copyToastTimer);
  copyToastTimer = window.setTimeout(() => {
    copyToast.classList.remove("is-visible");
  }, 1800);
};

const exitIntro = () => {
  if (introHasExited) {
    return;
  }

  introHasExited = true;
  launchScreen.classList.add("is-hidden");
  body.classList.remove("is-intro-active");
  window.setTimeout(() => {
    launchScreen.remove();
  }, 850);
};

const setupIntro = () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    exitIntro();
    return;
  }

  window.addEventListener("load", () => {
    window.setTimeout(exitIntro, 1650);
  });

  skipIntro.addEventListener("click", exitIntro);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      exitIntro();
    }
  });
};

const setupThemeToggle = () => {
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.classList.contains("dark") ? "light" : "dark";
    setTheme(nextTheme);
  });
};

const setupMobileMenu = () => {
  menuToggle.addEventListener("click", () => {
    const isHidden = mobileMenu.classList.toggle("hidden");
    menuToggle.setAttribute("aria-expanded", String(!isHidden));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
};

const setupRevealAnimations = () => {
  const revealElements = document.querySelectorAll("[data-reveal]");

  revealElements.forEach((element) => {
    const delay = element.dataset.delay || "0";
    element.style.setProperty("--delay", `${delay}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
};

const setupActiveSectionLinks = () => {
  const activateLink = (sectionId) => {
    sectionLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.sectionLink === sectionId);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleSection) {
        activateLink(visibleSection.target.id);
      }
    },
    {
      threshold: [0.3, 0.55, 0.75],
      rootMargin: "-18% 0px -35% 0px"
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
};

const bindMagneticElement = (element) => {
  if (element.dataset.magneticBound) {
    return;
  }

  element.dataset.magneticBound = "true";

  element.addEventListener("mousemove", (event) => {
    if (!supportsFinePointer) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    const moveX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
    const moveY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 10;

    element.style.setProperty("--mx", `${moveX}px`);
    element.style.setProperty("--my", `${moveY}px`);
  });

  element.addEventListener("mouseleave", () => {
    element.style.setProperty("--mx", "0px");
    element.style.setProperty("--my", "0px");
  });
};

const bindTiltElement = (element) => {
  if (element.dataset.tiltBound) {
    return;
  }

  element.dataset.tiltBound = "true";

  element.addEventListener("mousemove", (event) => {
    if (!supportsFinePointer) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
    const rotateY = offsetX * 10;
    const rotateX = offsetY * -10;

    element.style.setProperty("--rx", `${rotateX}deg`);
    element.style.setProperty("--ry", `${rotateY}deg`);
    element.style.setProperty("--ix", `${offsetX * 2}px`);
    element.style.setProperty("--iy", `${offsetY * 2}px`);
    element.style.setProperty("--spotlight-x", `${(offsetX + 0.5) * 100}%`);
    element.style.setProperty("--spotlight-y", `${(offsetY + 0.5) * 100}%`);
    element.style.setProperty("--spotlight-opacity", "1");
  });

  element.addEventListener("mouseleave", () => {
    element.style.setProperty("--rx", "0deg");
    element.style.setProperty("--ry", "0deg");
    element.style.setProperty("--ix", "0px");
    element.style.setProperty("--iy", "0px");
    element.style.setProperty("--spotlight-opacity", "0");
  });
};

const initializeInteractiveElements = (scope = document) => {
  scope.querySelectorAll("[data-magnetic]").forEach(bindMagneticElement);
  scope.querySelectorAll("[data-tilt]").forEach(bindTiltElement);
};

const setupCursorAura = () => {
  if (!supportsFinePointer) {
    return;
  }

  let auraX = window.innerWidth / 2;
  let auraY = window.innerHeight / 2;
  let dotX = auraX;
  let dotY = auraY;
  let targetX = auraX;
  let targetY = auraY;

  document.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursorAura.style.opacity = "1";
    cursorDot.style.opacity = "1";
  });

  document.addEventListener("pointerover", (event) => {
    if (event.target.closest("a, button, [data-tilt], .skill-pill")) {
      cursorAura.classList.add("is-active");
    }
  });

  document.addEventListener("pointerout", (event) => {
    if (event.target.closest("a, button, [data-tilt], .skill-pill")) {
      cursorAura.classList.remove("is-active");
    }
  });

  const animateCursor = () => {
    auraX += (targetX - auraX) * 0.14;
    auraY += (targetY - auraY) * 0.14;
    dotX += (targetX - dotX) * 0.28;
    dotY += (targetY - dotY) * 0.28;

    cursorAura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) translate(-50%, -50%)`;
    cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

    window.requestAnimationFrame(animateCursor);
  };

  animateCursor();
};

const createProjectCard = (project, index) => {
  const card = document.createElement("article");
  const mark = project.title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  card.className = "project-card";
  card.style.setProperty("--delay", `${index * 130}ms`);

  const tagsMarkup = (project.tags || ["Case Study"])
    .map((tag) => `<span class="project-tag">${tag}</span>`)
    .join("");

  card.innerHTML = `
    <div class="project-card-body interactive-surface tilt-shell" data-tilt data-spotlight>
      <div class="flex items-start justify-between gap-4">
        <span class="eyebrow-chip">0${index + 1}</span>
        <span class="project-mark">${mark}</span>
      </div>
      <div>
        <h3 class="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">${project.title}</h3>
        <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">${project.description}</p>
      </div>
      <div class="flex flex-wrap gap-2">${tagsMarkup}</div>
      <a
        href="${project.link}"
        class="project-link magnetic"
        data-magnetic
        ${project.link.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}
      >
        View Project
      </a>
    </div>
  `;

  return card;
};

const loadProjects = async () => {
  try {
    const response = await fetch("/projects");
    if (!response.ok) {
      throw new Error("Unable to fetch projects");
    }

    const projects = await response.json();
    projectsGrid.innerHTML = "";

    projects.forEach((project, index) => {
      const card = createProjectCard(project, index);
      projectsGrid.appendChild(card);

      window.requestAnimationFrame(() => {
        card.classList.add("is-loaded");
      });
    });

    initializeInteractiveElements(projectsGrid);
    projectsStatus.textContent = "Selected product, interface, and visual design work.";
  } catch (error) {
    projectsStatus.textContent = "Project data could not be loaded right now.";
    projectsGrid.innerHTML = `
      <article class="surface-card rounded-[2rem] p-6">
        <p class="text-base text-slate-600 dark:text-slate-300">
          The project gallery is temporarily unavailable. Please try again after starting the backend server.
        </p>
      </article>
    `;
  }
};

const copyText = async (button) => {
  const value = button.dataset.copy;
  const defaultLabel = button.dataset.defaultLabel || "Copy";

  try {
    await navigator.clipboard.writeText(value);
    button.textContent = "Copied";
    showCopyToast(`${value} copied`);
  } catch (error) {
    button.textContent = "Failed";
    showCopyToast("Copy action failed");
  }

  window.setTimeout(() => {
    button.textContent = defaultLabel;
  }, 1800);
};

const setupCopyButtons = () => {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => copyText(button));
  });
};

const openModal = () => {
  photoModal.classList.remove("hidden");
  window.requestAnimationFrame(() => {
    photoModal.classList.add("is-open");
  });
  photoModal.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
};

const closeModal = () => {
  photoModal.classList.remove("is-open");
  photoModal.setAttribute("aria-hidden", "true");
  window.setTimeout(() => {
    photoModal.classList.add("hidden");
  }, 260);
  body.style.overflow = body.classList.contains("is-intro-active") ? "hidden" : "";
};

const setupPhotoModal = () => {
  photoTrigger.addEventListener("click", openModal);

  photoModal.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && photoModal.classList.contains("is-open")) {
      closeModal();
    }
  });
};

const setupPhotoParallax = () => {
  const image = photoTrigger.querySelector(".photo-image");

  photoTrigger.addEventListener("mousemove", (event) => {
    if (!supportsFinePointer) {
      return;
    }

    const bounds = photoTrigger.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
    const rotateY = offsetX * 6;
    const rotateX = offsetY * -6;

    image.style.transform = `scale(1.08) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${offsetX * 18}px, ${offsetY * 18}px)`;
  });

  photoTrigger.addEventListener("mouseleave", () => {
    image.style.transform = "";
  });
};

initializeTheme();
setupIntro();
setupThemeToggle();
setupMobileMenu();
setupRevealAnimations();
setupActiveSectionLinks();
setupCursorAura();
setupCopyButtons();
setupPhotoModal();
setupPhotoParallax();
initializeInteractiveElements();
loadProjects();
