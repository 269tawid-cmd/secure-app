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

  // Update dropdown value if it exists
  const switcher = document.getElementById("lang-switcher");
  if (switcher) switcher.value = lang;
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
