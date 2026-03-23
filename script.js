const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const year = document.querySelector("#year");
const revealItems = document.querySelectorAll(".reveal");
const registrationForm = document.querySelector("#registration-form");
const clearRegistrationButton = document.querySelector("#clear-registration");
const registrationStatus = document.querySelector("#registration-status");
const registrationSummary = document.querySelector("#registration-summary");
const registrationEmailLink = document.querySelector("#registration-email-link");
const registrationStatusCopy = document.querySelector("#registration-status-copy");

const registrationDraftKey = "cal-victory-registration-draft";
const registrationSubmissionsKey = "cal-victory-registration-submissions";

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && header && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function getFormObject(form) {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}

function readStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    return;
  }
}

function populateForm(form, values) {
  Object.entries(values).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);

    if (!field) {
      return;
    }

    if (field instanceof RadioNodeList) {
      return;
    }

    if (field.type === "checkbox") {
      field.checked = value === "on" || value === true;
      return;
    }

    field.value = value;
  });
}

function saveDraft(form) {
  const values = getFormObject(form);
  const consentField = form.elements.namedItem("consent");

  if (consentField && consentField instanceof HTMLInputElement) {
    values.consent = consentField.checked ? "on" : "";
  }

  writeStorage(registrationDraftKey, JSON.stringify(values));
}

function clearDraft() {
  removeStorage(registrationDraftKey);
}

function appendSubmission(record) {
  const existing = JSON.parse(readStorage(registrationSubmissionsKey) || "[]");
  existing.push(record);
  writeStorage(registrationSubmissionsKey, JSON.stringify(existing));
}

function buildRegistrationSummary(values) {
  return [
    `Submitted: ${new Date().toLocaleString()}`,
    `Player: ${values.playerFirstName} ${values.playerLastName}`,
    `Date of birth: ${values.dateOfBirth}`,
    `Grade: ${values.grade}`,
    `Program interest: ${values.programInterest}`,
    `Preferred position: ${values.position || "Not provided"}`,
    `Experience: ${values.experience || "Not provided"}`,
    `Guardian: ${values.guardianName}`,
    `Guardian email: ${values.guardianEmail}`,
    `Guardian phone: ${values.guardianPhone}`,
    `Emergency contact: ${values.emergencyContact}`,
    `Emergency phone: ${values.emergencyPhone}`,
    `Medical notes: ${values.medicalNotes}`,
    `Parent notes: ${values.parentNotes || "Not provided"}`
  ].join("\n");
}

function updateRegistrationStatus(summary) {
  if (
    !registrationStatus ||
    !registrationSummary ||
    !registrationEmailLink ||
    !registrationStatusCopy
  ) {
    return;
  }

  registrationStatus.querySelector(".status-kicker").textContent = "Registration Captured";
  registrationStatus.querySelector("h3").textContent = "New player registration recorded.";
  registrationStatusCopy.textContent =
    "The intake summary has been saved in this browser. Keep it for the club's official GotSport registration link until the direct Cal Victory FC URL is added.";
  registrationSummary.textContent = summary;
  registrationEmailLink.href = "https://www.gotsport.com";
}

if (registrationForm) {
  const savedDraft = readStorage(registrationDraftKey);

  if (savedDraft) {
    try {
      populateForm(registrationForm, JSON.parse(savedDraft));
    } catch {
      clearDraft();
    }
  }

  registrationForm.addEventListener("input", () => {
    saveDraft(registrationForm);
  });

  registrationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!registrationForm.reportValidity()) {
      return;
    }

    const values = getFormObject(registrationForm);
    const summary = buildRegistrationSummary(values);
    const record = {
      ...values,
      submittedAt: new Date().toISOString()
    };

    appendSubmission(record);
    updateRegistrationStatus(summary);
    clearDraft();
    registrationForm.reset();
  });
}

if (clearRegistrationButton && registrationForm) {
  clearRegistrationButton.addEventListener("click", () => {
    registrationForm.reset();
    clearDraft();

    if (
      registrationStatus &&
      registrationSummary &&
      registrationEmailLink &&
      registrationStatusCopy
    ) {
      registrationStatus.querySelector(".status-kicker").textContent = "Awaiting Submission";
      registrationStatus.querySelector("h3").textContent = "Player registration is ready.";
      registrationStatusCopy.textContent =
        "Complete the intake form and keep the summary ready for the club's official GotSport registration link.";
      registrationSummary.textContent = "No registration submitted yet.";
      registrationEmailLink.href =
        "https://www.gotsport.com";
    }
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
