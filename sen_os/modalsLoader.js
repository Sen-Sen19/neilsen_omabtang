const modalFiles = [
  "files",
  "contact",
  "terminal",
  "notepad",
  "games",
  "photoshop",
  "trash",
  "browser",
  "projects",
];

/**
 * Loads a single modal HTML file and injects its root element into the body.
 * @param {string} name - The base name of the modal HTML file (without extension).
 */
function loadModal(name) {
  return fetch(`modals/${name}.html`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`[modalsLoader] Failed to load ${name}.html`);
      }
      return res.text();
    })
    .then((html) => {
      const div = document.createElement("div");
      div.innerHTML = html.trim();

      const modal = div.firstElementChild;

      // Avoid duplication if already exists
      if (!document.getElementById(modal.id)) {
        document.body.appendChild(modal);
        console.log(`[modalsLoader] Loaded: ${name}.html`);
      } else {
        console.warn(`[modalsLoader] Skipped: ${name}.html already exists.`);
      }
    })
    .catch((err) => {
      console.error(`[modalsLoader] Error loading ${name}.html`, err);
    });
}

/**
 * Loads all modals defined in the modalFiles array.
 */
export async function loadAllModals() {
  const promises = modalFiles.map(loadModal);
  await Promise.all(promises);
  console.log("[modalsLoader] All modals loaded successfully.");
}
