// windowManager.js

export class WindowManager {
  constructor({ modalId, taskbarSelector, iconSelector, restoreDefaults = {}, sections = {} }) {
    this.modal = document.getElementById(modalId);
    this.taskbarIcon = document.querySelector(taskbarSelector)?.closest('.taskbar-icon');
    this.desktopIcon = document.querySelector(iconSelector);
    this.maximizeBtn = this.modal.querySelector(".btn.restore");
    this.header = this.modal.querySelector(".modal-header");

    this.restoreState = {
      top: restoreDefaults.top || "100px",
      left: restoreDefaults.left || "100px",
      width: restoreDefaults.width || "650px",
      height: restoreDefaults.height || "400px",
    };

    this.sections = sections;
    this.currentSection = this.modal.querySelector("#current-section");
    this.sidebarTabs = this.modal.querySelector("#sidebar-tabs");
    this.modalContent = this.modal.querySelector("#modal-content");

    this.isOpened = false;
    this.isMinimized = false;

    this.init();
  }

  init() {
    this.bindEvents();
    this.enableDrag();
    if (this.sidebarTabs) this.setupSidebarNavigation();
  }

  bindEvents() {
    this.desktopIcon?.addEventListener("dblclick", () => this.toggleOpen());
    this.taskbarIcon?.addEventListener("click", () => this.toggleFromTaskbar());
    this.maximizeBtn?.addEventListener("click", () => this.toggleMaximize());

    const minimizeBtn = this.modal.querySelector(".btn.minimize");
    const closeBtn = this.modal.querySelector(".btn.close");

    minimizeBtn?.addEventListener("click", () => this.minimize());
    closeBtn?.addEventListener("click", () => this.close());

    document.addEventListener("mousedown", (e) => {
      const isInsideModal = this.modal.contains(e.target);
      const isTaskbarClick = this.taskbarIcon?.contains(e.target);
      const isDesktopIconClick = this.desktopIcon?.contains(e.target);

      if (
        !isInsideModal &&
        !isTaskbarClick &&
        !isDesktopIconClick &&
        !this.modal.classList.contains("hidden") &&
        !this.modal.classList.contains("maximized")
      ) {
        this.minimize();
      }
    });
  }

  close() {
    this.modal.classList.add("hidden");
    this.taskbarIcon?.classList.remove("folder-opened");
    this.isOpened = false;
    this.isMinimized = false;
  }

  toggleOpen() {
    if (!this.isOpened || this.isMinimized) {
      this.open();
    }
  }

  toggleFromTaskbar() {
    if (this.modal.classList.contains("hidden")) {
      this.open();
    } else {
      this.minimize();
    }
  }

  open() {
    this.modal.classList.remove("hidden");
    this.taskbarIcon?.classList.add("folder-opened");
    this.isMinimized = false;
    this.isOpened = true;

    if (!this.modal.classList.contains("maximized")) {
      this.modal.style.top = this.restoreState.top;
      this.modal.style.left = this.restoreState.left;
      this.modal.style.width = this.restoreState.width;
      this.modal.style.height = this.restoreState.height;
    }
  }

  minimize() {
    this.modal.classList.remove("maximized"); // force exit fullscreen first
    this.modal.classList.add("hidden");
    this.isMinimized = true;
  }

  toggleMaximize() {
    if (this.modal.classList.contains("maximized")) {
      this.modal.classList.remove("maximized");
      this.modal.style.top = this.restoreState.top;
      this.modal.style.left = this.restoreState.left;
      this.modal.style.width = this.restoreState.width;
      this.modal.style.height = this.restoreState.height;
      this.maximizeBtn.innerHTML = "&#x25A1;";
      this.maximizeBtn.title = "Maximize";
    } else {
      const rect = this.modal.getBoundingClientRect();
      this.restoreState = {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      };

      this.modal.classList.add("maximized");
      this.modal.style.top = "0";
      this.modal.style.left = "0";
      this.modal.style.width = "100vw";
      this.modal.style.height = "100vh";
      this.maximizeBtn.innerHTML = "&#x239A;";
      this.maximizeBtn.title = "Restore";
    }
  }

  enableDrag() {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    this.header.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;

      const isControlBtn = e.target.closest(".window-controls");
      if (isControlBtn) return;

      if (this.modal.classList.contains("maximized")) {
        this.toggleMaximize(); // unmaximize first
      }

      const rect = this.modal.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      this.modal.style.transition = "none";
      isDragging = true;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      this.modal.style.left = `${e.clientX - offsetX}px`;
      this.modal.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        const rect = this.modal.getBoundingClientRect();
        this.restoreState = {
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
        };
        isDragging = false;
      }
    });
  }

  setupSidebarNavigation() {
    this.sidebarTabs.addEventListener("click", (e) => {
      const clicked = e.target;
      if (clicked.tagName === 'LI') {
        const section = clicked.getAttribute("data-section");
        this.currentSection.textContent = section;

        [...this.sidebarTabs.children].forEach((li) => li.classList.remove("active"));
        clicked.classList.add("active");

        if (this.modalContent && this.sections[section]) {
          this.modalContent.innerHTML = `<p>${this.sections[section]}</p>`;
        }
      }
    });
  }
}
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

terminalInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') {
    const cmd = terminalInput.value.trim();
    if(cmd) {
      terminalOutput.textContent += '\n$ ' + cmd;
      terminalInput.value = '';
      // Here you can extend commands later
    }
    e.preventDefault();
  }
});












// Projects modal
const projectsWindow = new WindowManager({
  modalId: "projects-modal",
  iconSelector: ".icon img[src*='visual-studio-code']",
  taskbarSelector: ".taskbar-left .taskbar-icon img[src*='visual-studio-code']",
  restoreDefaults: {
    top: "120px", left: "240px", width: "700px", height: "500px"
  }
});

// Sample project list
const projects = [
  {
    name: "AI Slime Evolution",
    description: "An evolving slime AI that learns platforming using TensorFlow.js.",
    image: "https://via.placeholder.com/400x200?text=Slime+AI",
    demo: "#",
    github: "#",
    video: "#"
  },
  {
    name: "Falling Sand Simulator",
    description: "A dynamic sandbox game with pixel-based reactions and elemental interactions.",
    image: "https://via.placeholder.com/400x200?text=Sand+Sim",
    demo: "#",
    github: "#",
    video: "#"
  },
  {
    name: "Sen OS XXI",
    description: "The futuristic OS interface you're looking at — custom desktop UI in the browser.",
    image: "https://via.placeholder.com/400x200?text=Sen+OS",
    demo: "#",
    github: "#"
  }
];

const container = document.getElementById('projects-list');
projects.forEach(proj => {
  const el = document.createElement('div');
  el.className = 'project-card';
  el.innerHTML = `
    <img src="${proj.image}" alt="${proj.name}">
    <div class="info">
      <h3>${proj.name}</h3>
      <p>${proj.description}</p>
      <div class="actions">
        ${proj.demo ? `<a href="${proj.demo}" target="_blank">Live</a>` : ''}
        ${proj.github ? `<a href="${proj.github}" target="_blank">GitHub</a>` : ''}
        ${proj.video ? `<a href="${proj.video}" target="_blank">Video</a>` : ''}
      </div>
    </div>
  `;
  container.appendChild(el);
});







const tabs = document.querySelectorAll('#browser-tabs .tab');
const iframe = document.getElementById('browser-frame');
const urlBar = document.getElementById('browser-url');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const url = tab.dataset.url;
    const type = tab.dataset.type;

    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    if (type === 'external') {
      window.open(url, '_blank');
    } else {
      iframe.src = url;
      urlBar.value = url;
    }
  });
});


// browserUrlInput.addEventListener("change", () => {
//   browserIframe.src = browserUrlInput.value;
// });
