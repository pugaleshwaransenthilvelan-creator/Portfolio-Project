/* =========================================================
   SETTINGS  (change these)
   ========================================================= */

// Paste your Google Apps Script Web App URL here (see Part 2 and Part 3)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxdhG2aNUKZN2_SGVLpzYLuLTsfBMmyS-Ie8txKf2ZSfdx_bHnFRWXgQqYWTg59LZ5m/exec";

// Demonstration-only login. NOT secure: anyone can read this in the browser.
const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "admin123";

/* =========================================================
   1. SELECT HTML ELEMENTS WE NEED
   ========================================================= */
const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section");

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const formStatus = document.getElementById("form-status");

const loginBox = document.getElementById("login-box");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const responsesPanel = document.getElementById("responses-panel");
const responsesList = document.getElementById("responses-list");
const responsesStatus = document.getElementById("responses-status");
const logoutBtn = document.getElementById("logout-btn");
const refreshBtn = document.getElementById("refresh-btn");

/* =========================================================
   2. MOBILE MENU
   ========================================================= */
function closeMenu() {
  navMenu.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close the menu after tapping a link
navLinks.forEach((link) => link.addEventListener("click", closeMenu));

/* =========================================================
   3. HIGHLIGHT THE CURRENT SECTION IN THE NAVBAR
   ========================================================= */
function updateActiveLink() {
  // Add a shadow to the navbar once the page is scrolled
  navbar.classList.toggle("scrolled", window.scrollY > 10);

  let currentId = "home";
  const scrollPosition = window.scrollY + 120; // small offset for the fixed navbar

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
  });
}

window.addEventListener("scroll", updateActiveLink);
updateActiveLink();

/* =========================================================
   4. LIGHT / DARK THEME (saved in localStorage)
   ========================================================= */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  // Show the icon of the mode you will switch TO
  themeIcon.textContent = theme === "dark" ? "☀" : "🌙";
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

// Restore the saved theme when the page loads
applyTheme(localStorage.getItem("theme") || "light");

/* =========================================================
   5. TYPING ANIMATION IN THE HERO SECTION
   ========================================================= */
const typingWords = ["Web Developer in the making", "Problem Solver", "Lifelong Learner"];
const typingElement = document.getElementById("typing");
let wordIndex = 0;
let letterIndex = 0;
let isDeleting = false;

function typeEffect() {
  const word = typingWords[wordIndex];

  if (isDeleting) {
    letterIndex--;
  } else {
    letterIndex++;
  }
  typingElement.textContent = word.substring(0, letterIndex);

  let delay = isDeleting ? 40 : 90;

  if (!isDeleting && letterIndex === word.length) {
    isDeleting = true;
    delay = 1500; // pause when the word is complete
  } else if (isDeleting && letterIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % typingWords.length;
    delay = 400;
  }
  setTimeout(typeEffect, delay);
}
typeEffect();

/* =========================================================
   6. SCROLL REVEAL + SKILL BARS
   IntersectionObserver tells us when an element enters the screen.
   ========================================================= */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");

      // If this card is a skill card, fill its progress bar
      if (entry.target.classList.contains("skill")) {
        const level = entry.target.dataset.level;
        entry.target.querySelector(".progress-fill").style.width = level + "%";
      }
      observer.unobserve(entry.target); // animate only once
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

/* =========================================================
   7. CONTACT FORM VALIDATION
   ========================================================= */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^[6-9][0-9]{9}$/; // Indian 10-digit mobile number

// Show or clear an error under a field
function setFieldState(fieldId, message) {
  const input = document.getElementById(fieldId);
  const wrapper = input.closest(".field");
  const errorElement = document.getElementById(fieldId + "-error");

  errorElement.textContent = message;
  wrapper.classList.toggle("invalid", message !== "");
  wrapper.classList.toggle("valid", message === "");
}

// Each function returns an error message, or "" if the value is valid
function validateName() {
  const value = document.getElementById("name").value.trim();
  if (value === "") return "Name is required.";
  if (value.length < 2) return "Name must have at least 2 characters.";
  return "";
}

function validateEmail() {
  const value = document.getElementById("email").value.trim();
  if (value === "") return "Email is required.";
  if (!emailPattern.test(value)) return "Enter a valid email, like name@example.com.";
  return "";
}

function validatePhone() {
  const value = document.getElementById("phone").value.trim();
  if (value === "") return "Phone number is required.";
  if (!phonePattern.test(value)) return "Enter a valid 10-digit mobile number.";
  return "";
}

function validateSubject() {
  const value = document.getElementById("subject").value.trim();
  if (value === "") return "Subject is required.";
  return "";
}

function validateMessage() {
  const value = document.getElementById("message").value.trim();
  if (value === "") return "Message is required.";
  if (value.length < 5) return "Message must have at least 5 characters.";
  return "";
}

// Map each field to its validator
const validators = {
  name: validateName,
  email: validateEmail,
  phone: validatePhone,
  subject: validateSubject,
  message: validateMessage,
};

// Validate a field while the user types or leaves it
Object.keys(validators).forEach((fieldId) => {
  const input = document.getElementById(fieldId);
  input.addEventListener("blur", () => setFieldState(fieldId, validators[fieldId]()));
  input.addEventListener("input", () => {
    // Re-check live only after the field has been marked once
    if (input.closest(".field").classList.contains("invalid")) {
      setFieldState(fieldId, validators[fieldId]());
    }
  });
});

// Run all validators. Returns true only if every field is valid.
function validateForm() {
  let allValid = true;
  Object.keys(validators).forEach((fieldId) => {
    const message = validators[fieldId]();
    setFieldState(fieldId, message);
    if (message !== "") allValid = false;
  });
  return allValid;
}

function showStatus(element, text, type) {
  element.textContent = text;
  element.className = "form-status " + type; // type is "success" or "fail"
}

/* =========================================================
   8. SEND THE FORM TO GOOGLE SHEETS (via Apps Script)
   ========================================================= */
function isScriptUrlSet() {
  return SCRIPT_URL && SCRIPT_URL !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // stop the page from reloading
  formStatus.textContent = "";

  if (!validateForm()) {
    showStatus(formStatus, "Please fix the errors above and try again.", "fail");
    return;
  }

  if (!isScriptUrlSet()) {
    showStatus(formStatus, "Setup needed: add your Apps Script URL to SCRIPT_URL in script.js.", "fail");
    return;
  }

  // 1. Collect the form data into a JavaScript object
  const formData = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    subject: document.getElementById("subject").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  try {
    // 2. Send it to Google Apps Script as JSON text.
    // "text/plain" avoids a CORS preflight request, which Apps Script cannot answer.
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(formData),
    });

    // 3. Read the JSON reply from Apps Script
    const result = await response.json();

    if (result.status === "success") {
      showStatus(formStatus, "Thank you! Your message was sent successfully.", "success");
      contactForm.reset();
      document.querySelectorAll("#contact-form .field").forEach((f) => f.classList.remove("valid", "invalid"));

      // If the admin panel is open, show the new response straight away
      if (sessionStorage.getItem("loggedIn") === "true") loadResponses();
    } else {
      showStatus(formStatus, result.message || "Something went wrong. Please try again.", "fail");
    }
  } catch (error) {
    console.error("Submit error:", error);
    showStatus(formStatus, "Could not reach the server. Check your internet and Web App URL.", "fail");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
  }
});

// Reset button: clear errors and messages as well
contactForm.addEventListener("reset", () => {
  formStatus.textContent = "";
  Object.keys(validators).forEach((fieldId) => {
    document.getElementById(fieldId + "-error").textContent = "";
    document.getElementById(fieldId).closest(".field").classList.remove("valid", "invalid");
  });
});

/* =========================================================
   9. LOAD AND DISPLAY RESPONSES FROM GOOGLE SHEETS
   ========================================================= */

// Convert a timestamp into dd/mm/yyyy
function formatDate(value) {
  const date = new Date(value);
  if (isNaN(date)) return String(value); // show raw text if it cannot be parsed
  return date.toLocaleDateString("en-GB");
}

// Build one response card using DOM methods.
// textContent (not innerHTML) is used so visitors cannot inject HTML or scripts.
function createResponseCard(item) {
  const card = document.createElement("article");
  card.className = "card response-card";

  const name = document.createElement("h3");
  name.textContent = "Name: " + item.name;

  const subject = document.createElement("p");
  subject.className = "subject";
  subject.textContent = "Subject: " + item.subject;

  const message = document.createElement("p");
  message.className = "message";
  message.textContent = "Message: " + item.message;

  const date = document.createElement("p");
  date.className = "date";
  date.textContent = "Date: " + formatDate(item.timestamp);

  card.append(name, subject, message, date);
  return card;
}

async function loadResponses() {
  if (!isScriptUrlSet()) {
    showStatus(responsesStatus, "Setup needed: add your Apps Script URL to SCRIPT_URL in script.js.", "fail");
    return;
  }

  showStatus(responsesStatus, "Loading responses...", "");
  responsesList.innerHTML = "";

  try {
    // GET request: the action name tells Apps Script what we want
    const response = await fetch(SCRIPT_URL + "?action=getResponses");
    const result = await response.json();

    if (result.status !== "success") {
      showStatus(responsesStatus, result.message || "Could not load responses.", "fail");
      return;
    }

    if (result.data.length === 0) {
      showStatus(responsesStatus, "No responses yet.", "");
      return;
    }

    showStatus(responsesStatus, result.data.length + " response(s) found.", "success");

    // Show the newest response first
    result.data.slice().reverse().forEach((item) => {
      responsesList.appendChild(createResponseCard(item));
    });
  } catch (error) {
    console.error("Load error:", error);
    showStatus(responsesStatus, "Could not load responses. Check your Web App URL and deployment.", "fail");
  }
}

refreshBtn.addEventListener("click", loadResponses);

/* =========================================================
   10. DEMO LOGIN (show / hide the responses section)
   ========================================================= */
function showResponsesPanel() {
  loginBox.classList.add("hidden");
  responsesPanel.classList.remove("hidden");
  loadResponses();
}

function showLoginBox() {
  responsesPanel.classList.add("hidden");
  loginBox.classList.remove("hidden");
  responsesList.innerHTML = "";
  responsesStatus.textContent = "";
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    sessionStorage.setItem("loggedIn", "true"); // remembered until the tab is closed
    loginError.textContent = "";
    loginForm.reset();
    showResponsesPanel();
  } else {
    loginError.textContent = "Wrong username or password.";
  }
});

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("loggedIn");
  showLoginBox();
});

// If the user was already logged in (page refresh), skip the login box
if (sessionStorage.getItem("loggedIn") === "true") {
  showResponsesPanel();
}
