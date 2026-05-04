function updateLanguage(lang) {
  localStorage.setItem("selectedLang", lang);
  document.documentElement.lang = lang;

  // Handle RTL for Arabic
  if (lang === "ar") {
    document.documentElement.dir = "rtl";
    document.body.classList.add("rtl");
  } else {
    document.documentElement.dir = "ltr";
    document.body.classList.remove("rtl");
  }

  // Animate the switcher globe icon
  const wrapper = document.querySelector(".lang-switcher-wrapper");
  if (wrapper) {
    wrapper.classList.add("lang-globe-spin");
    setTimeout(() => wrapper.classList.remove("lang-globe-spin"), 600);
  }

  // Add fade-out effect, then update text, then fade-in
  document.body.classList.add("i18n-fade-out");

  setTimeout(() => {
    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        el.innerText = translations[lang][key];
      }
    });

    // Update placeholders
    const inputs = document.querySelectorAll("[data-i18n-placeholder]");
    inputs.forEach(input => {
      const key = input.getAttribute("data-i18n-placeholder");
      if (translations[lang] && translations[lang][key]) {
        input.placeholder = translations[lang][key];
      }
    });

    // Animate the lang-select
    const switcher = document.getElementById("lang-switcher");
    if (switcher) {
      switcher.classList.add("lang-changing");
      setTimeout(() => switcher.classList.remove("lang-changing"), 400);
      switcher.value = lang;
    }

    document.body.classList.remove("i18n-fade-out");
    document.body.classList.add("i18n-fade-in");
    setTimeout(() => document.body.classList.remove("i18n-fade-in"), 300);
  }, 200);
}

// Language Switcher Event
function initI18n() {
  const savedLang = localStorage.getItem("selectedLang") || "en";
  updateLanguage(savedLang);

  const switcher = document.getElementById("lang-switcher");
  if (switcher) {
    switcher.addEventListener("change", (e) => {
      updateLanguage(e.target.value);
    });
  }
}

// Load translations and initialize
document.addEventListener("DOMContentLoaded", initI18n);
