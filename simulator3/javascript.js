const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 6;
const grid = [];
const particleSpatters = [];
const acidBubbles = [];
const acidFog = [];
const gasParticles = [];
const activeBombs = [];
const activeNukes = [];
const insects = [];
const trailParticles = [];
const fireParticles = []; 
const toxicSmokeParticles = [];
let lastSprinkleTime = 0;
const SPRINKLE_COOLDOWN = 50; // ms
const SPRINKLE_CHANCE = 0.1;  // 10% chance per pixel


let cols, rows;

function resizeCanvas() {
  const guiHeight = document.querySelector(".gui")?.offsetHeight || 80;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - guiHeight;
  updateGridSize();
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateGridSize() {
  cols = Math.floor(canvas.width / gridSize);
  rows = Math.floor(canvas.height / gridSize);
  grid.length = 0;
  for (let y = 0; y < rows; y++) {
    grid.push(Array(cols).fill(null));
  }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let selectedMaterial = "Water";
let brushSize = 1;
let isErasing = false;
let isDrawing = false;
let mousePos = null;
let hasSpawnedSingleMaterial = false; // ✅ NEW: for one-time bombs/nukes

const eraserButton = document.getElementById("eraserButton");

function updateEraserButton() {
  if (isErasing) {
    eraserButton.style.background = "#a33";
    eraserButton.textContent = "❌";
    eraserButton.title = "Eraser (Active)";
  } else {
    eraserButton.style.background = "#444";
    eraserButton.textContent = "🩹";
    eraserButton.title = "Eraser";
  }
}

// Brush controls
document.getElementById("brushRange").oninput = function (e) {
  brushSize = parseInt(e.target.value);
  document.getElementById("brushValue").textContent = brushSize;
};

// Modal toggle
document.getElementById("materialToggle").onclick = function () {
  const modal = document.getElementById("materialModal");
  if (modal) modal.style.display = "flex";
};

// Modal logic - loading external modal.html and setting listeners
fetch("modal.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("modalContainer").innerHTML = html;
    requestAnimationFrame(setupModalListeners);
  });

function setupModalListeners() {
  const materialItems = document.querySelectorAll(".material-item");
  materialItems.forEach((item) => {
    item.addEventListener("click", function () {
      const emoji = this.querySelector(".material-emoji")?.textContent || "?";
      const label = this.textContent.replace(/^[^\w]+/, "").trim();
      selectedMaterial = label;
      document.getElementById("materialToggle").textContent = emoji;
      document.getElementById("materialModal").style.display = "none";

      isErasing = false;
      updateEraserButton();
    });
  });

  const modal = document.getElementById("materialModal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.style.display = "none";
    });
  }
}
function spawnMaterial(x, y) {
  const gridX = Math.floor(x / gridSize);
  const gridY = Math.floor(y / gridSize);
if (selectedMaterial === "Seed") {
  const now = performance.now();
  const sprinkleAttempts = 20;
  for (let i = 0; i < sprinkleAttempts; i++) {
    const dx = rand(-brushSize, brushSize);
    const dy = rand(-brushSize, brushSize);
    const nx = gridX + dx;
    const ny = gridY + dy;

    if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
    if (grid[ny][nx] !== null) continue;

  if (Math.random() < SPRINKLE_CHANCE) {
  grid[ny][nx] = {
    type: "Seed",
    spawnedAt: now,
    lastMovedAt: now,
    color: powderMaterials["Seed"].color()  // assign fixed color
  };
}

  }
  return;
}

  if (
    gridX < 0 || gridX >= cols || 
    gridY < 0 || gridY >= rows || 
    !selectedMaterial
  ) return;

  // ✨ Handle Seeds with sprinkle logic
   // ✨ Handle sprinkled materials
  const sprinkledTypes = ["Seed", "Snow", "Fireworks"];
  if (sprinkledTypes.includes(selectedMaterial)) {
    const now = performance.now();
    if (now - lastSprinkleTime < SPRINKLE_COOLDOWN) return;
    lastSprinkleTime = now;
 const sprinkleAttempts = 5;
     for (let i = 0; i < sprinkleAttempts; i++) {
    const dx = Math.floor(rand(-brushSize, brushSize));
    const dy = Math.floor(rand(-brushSize, brushSize));
    const nx = gridX + dx;
    const ny = gridY + dy;

    if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
    if (grid[ny][nx] !== null) continue;

    if (Math.random() < SPRINKLE_CHANCE) {
      grid[ny][nx] = selectedMaterial;
    }
  }

  return;
}

  // 🐝 Insects
  if (selectedMaterial === "Bee" || selectedMaterial === "Firefly" || selectedMaterial === "Butterfly") {
    insects.push(new Insect(x, y, selectedMaterial));
    return;
  }

  // 💣 Bombs / Nukes (one-time spawn)
  const cx = gridX;
  const cy = gridY;
  if (selectedMaterial === "Bomb" || selectedMaterial === "Nuclear Bomb") {
    if (hasSpawnedSingleMaterial) return;
    if (cx >= 0 && cx < cols && cy >= 0 && cy < rows && grid[cy][cx] === null) {
      grid[cy][cx] = {
        type: selectedMaterial,
        life: selectedMaterial === "Bomb" ? 360 : 60,
        vx: 0,
        vy: 0,
        color: getMaterialColor(selectedMaterial, cx, cy),
      };
      hasSpawnedSingleMaterial = true;
    }
    return;
  }

  // 🔥 Fire — ephemeral, burns while drawing only
  if (selectedMaterial === "Fire") {
    for (let dy = -brushSize; dy <= brushSize; dy++) {
      for (let dx = -brushSize; dx <= brushSize; dx++) {
        if (Math.random() < 0.9) { // Denser effect
          const nx = x + dx * gridSize + rand(-2, 2);
          const ny = y + dy * gridSize + rand(-2, 2);
          fireParticles.push(new FireParticle(nx, ny));
        }
      }
    }
    return;
  }



  // 🧽 Regular materials & erasing
  for (let dy = -brushSize; dy <= brushSize; dy++) {
    for (let dx = -brushSize; dx <= brushSize; dx++) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        if (isErasing) {
          grid[ny][nx] = null;
        } else {
          if (selectedMaterial === "Steam" || selectedMaterial === "Gas") {
            gasParticles.push(new GasParticle(nx, ny, selectedMaterial));
          } else {
            grid[ny][nx] = selectedMaterial;
          }
        }
      }
    }
  }
}


// ================================================================= Mouse & touch input handlers =================================================================
canvas.addEventListener("mousedown", function (e) {
  isDrawing = true;
  hasSpawnedSingleMaterial = false;
  mousePos = { x: e.clientX, y: e.clientY };
});
canvas.addEventListener("mouseup", function () {
  isDrawing = false;
  mousePos = null;
});

canvas.addEventListener("mousemove", function (e) {
  mousePos = { x: e.clientX, y: e.clientY };
  if (isDrawing && e.clientY < canvas.height)
    spawnMaterial(e.clientX, e.clientY);
});

canvas.addEventListener("touchstart", function (e) {
  isDrawing = true;
  hasSpawnedSingleMaterial = false;
  const t = e.touches[0];
  mousePos = { x: t.clientX, y: t.clientY };
});

canvas.addEventListener("touchend", function () {
  isDrawing = false;
  mousePos = null;
});

canvas.addEventListener(
  "touchmove",
  function (e) {
    e.preventDefault();
    const t = e.touches[0];
    if (isDrawing && t.clientY < canvas.height) {
      mousePos = { x: t.clientX, y: t.clientY };
      spawnMaterial(t.clientX, t.clientY);
    }
  },
  { passive: false }
);

// Combine all materials
const materials = {
  ...liquidMaterials,
  ...powderMaterials,
  ...solidMaterials,
  ...gasMaterials,
  ...explodeMaterials,
  ...insectMaterials,
  ...fireMaterials, 
};



// Clear button resets grid
document.getElementById("clearButton").onclick = function () {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x] = null;
    }
  }
};

// Eraser toggle button
eraserButton.onclick = function () {
  isErasing = !isErasing;
  updateEraserButton();
};

// ================================================================= Particle Classed // =================================================================
// ============================ Trail Particle ============================
class TrailParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 1.5 + 0.5; // Small sparkles
    this.color = color;
    this.alpha = 1;
this.life = Math.random() * 20 + 30;// Shorter life
    this.dx = (Math.random() - 0.5) * 0.5;
    this.dy = (Math.random() - 0.5) * 0.5;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.alpha -= 0.03;
    this.life--;
  }

  isDead() {
    return this.life <= 0 || this.alpha <= 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}


// ============================ Acid Particle ============================
class AcidFogParticle {
  constructor(x, y) {
    this.x = x + rand(-0.5, 0.5);
    this.y = y;
    this.vx = rand(-1, 1) * 0.02;
    this.vy = -0.02 - Math.random() * 0.03;
    this.radius = 4 + Math.random() * 3;
    this.life = 100 + rand(0, 30);
  }

  update() {
    // Slight upward flow with drifting
    this.x += this.vx + (Math.random() - 0.5) * 0.02; // add more chaos
    this.y += this.vy + (Math.random() - 0.5) * 0.01; // add slight vertical flutter

    this.life--;

    // Optional steam-to-water transformation (if you want it)
    if (
      this.type === "Steam" &&
      this.life <= 0 &&
      Math.random() < 0.05 &&
      steamToWaterThisFrame < MAX_WATER_FROM_STEAM
    ) {
      const gx = Math.floor(this.x);
      const gy = Math.floor(this.y + 2);
      if (
        gx >= 0 &&
        gx < cols &&
        gy >= 0 &&
        gy < rows &&
        grid[gy][gx] === null
      ) {
        grid[gy][gx] = "Water";
        steamToWaterThisFrame++;
      }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    const alpha = this.life / this.lifeMax;
    ctx.fillStyle =
      this.type === "Gas"
        ? `rgba(180,255,180,${alpha * 0.2})`
        : `rgba(200,200,255,${alpha * 0.3})`;

    ctx.arc(this.x * gridSize, this.y * gridSize, this.radius, 0, Math.PI * 2);
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  isAlive() {
    return this.life > 0;
  }
}

class AcidBubbleParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vy = -0.05 - Math.random() * 0.1;
    this.radius = 1 + Math.random();
    this.life = 60 + Math.floor(Math.random() * 30);
  }

  update() {
    this.y += this.vy;
    this.life--;
  }

  isAlive() {
    return this.life > 0;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x * gridSize, this.y * gridSize, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 255, 100, ${this.life / 90})`;
    ctx.shadowColor = "lime";
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}
// ============================ Lava Particle ============================
class LavaSpitParticle {
  constructor(x, y) {
    this.x = x + rand(-0.2, 0.2);
    this.y = y;
    this.life = 20 + rand(0, 10);
    this.opacity = 1;
  }

  update() {
    this.y -= 0.15 + Math.random() * 0.1;
    this.life--;
    this.opacity = this.life / 30;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 120, 0, ${this.opacity})`;
    ctx.shadowColor = "orange";
    ctx.shadowBlur = 6;
    ctx.arc(this.x * gridSize, this.y * gridSize, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  isAlive() {
    return this.life > 0;
  }
}
function isGas(type) {
  return Object.hasOwn(gasMaterials, type);
}

// ============================ Fire Particle ============================
class FireParticle {
  constructor(x, y) {
    this.x = x + rand(-2, 2);
    this.y = y + rand(-2, 2);
    this.radius = rand(6, 12);
    this.life = rand(30, 50);
    this.maxLife = this.life;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = -Math.random() * 1.5 - 0.5;
  }

  update() {
    this.x += this.vx + (Math.random() - 0.5) * 0.2;
    this.y += this.vy;
    this.life--;
  }

  isAlive() {
    return this.life > 0;
  }

  draw(ctx) {
    const progress = 1 - this.life / this.maxLife;
    const alpha = 1 - progress;
    const radius = this.radius * (1 - progress * 0.5);

    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, radius
    );

    gradient.addColorStop(0, `rgba(255, 255, 0, ${alpha})`);
    gradient.addColorStop(0.3, `rgba(255, 140, 0, ${alpha * 0.8})`);
    gradient.addColorStop(1, `rgba(255, 0, 0, ${alpha * 0.3})`);

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
if (isDrawing && selectedMaterial === "Fire" && mousePos) {
  spawnMaterial(mousePos.x, mousePos.y);
}


// ============================ Gas Particle ============================

class GasParticle {
  constructor(x, y, type) {
    this.x = x + Math.random();
    this.y = y + Math.random();
    this.vx = (Math.random() - 0.5) * 0.12; // wide spread horizontally
    this.vy = 0; // no rise initially
    this.radius = 2.5 + Math.random() * 2;
    this.life = 240 + Math.random() * 100; // longer lasting
    this.lifeMax = this.life;
    this.type = type;this.type = type;

  }

  update() {
    this.vx += (Math.random() - 0.5) * 0.02;
    this.vy += (Math.random() - 0.5) * 0.02;

    this.vx = Math.max(-0.3, Math.min(0.3, this.vx));
    this.vy = Math.max(-0.3, Math.min(0.3, this.vy));

    this.x += this.vx;
    this.y += this.vy;

    this.life--;

    let steamToWaterThisFrame = 0;
    const MAX_WATER_FROM_STEAM = 2;
    if (
      this.type === "Steam" &&
      this.life <= 0 &&
      steamToWaterThisFrame < MAX_WATER_FROM_STEAM &&
      Math.random() < 0.1
    ) {
      const gx = Math.floor(this.x);
      const gy = Math.floor(this.y + 2);
      if (
        gx >= 0 &&
        gx < cols &&
        gy >= 0 &&
        gy < rows &&
        grid[gy][gx] === null
      ) {
        grid[gy][gx] = "Water";
        steamToWaterThisFrame++;
      }
    }
  }

  draw(ctx) {
  const gradient = ctx.createRadialGradient(
    this.x, this.y, 0,
    this.x, this.y, this.size
  );

  gradient.addColorStop(0, `rgba(180, 255, 180, ${this.opacity * 0.2})`);
  gradient.addColorStop(1, `rgba(80, 255, 120, 0)`);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size * 1.2, 0, Math.PI * 2); // slightly larger puff
  ctx.fill();
}

  isAlive() {
    return this.life > 0;
  }
}



// ============================ Insect Class ============================
class Insect {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.life = 9999;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 0.5 + Math.random();
    this.osc = 0;

    // 🦋 Butterfly-specific initialization
    if (type === "Butterfly") {
      const colors = ["violet", "skyblue", "orange", "yellow", "pink", "magenta", "turquoise", "lime", "red", "blue", "cyan"];
      this.color1 = colors[rand(0, colors.length - 1)];
      this.patternType = ["dots", "lines", "none"][rand(0, 2)];
    }
  }

  update() {
    this.osc += 0.1;

    switch (this.type) {
      case "Bee":
        this.angle += (Math.random() - 0.5) * 0.5;
        this.x += Math.cos(this.angle) * this.speed * 2;
        this.y += Math.sin(this.angle) * this.speed * 2;
        break;

      case "Firefly":
        this.angle += (Math.random() - 0.5) * 0.2;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        break;

      case "Butterfly":
        this.angle += (Math.random() - 0.5) * 0.2;
        this.x += Math.cos(this.angle) * this.speed * 0.8;
        this.y += Math.sin(this.angle) * this.speed * 0.8;
        break;
    }

    // Stay inside canvas
    this.x = Math.max(0, Math.min(canvas.width, this.x));
    this.y = Math.max(0, Math.min(canvas.height, this.y));

    // Leave trail
    this.leaveTrail();
  }

leaveTrail() {
  let trailColor;

  switch (this.type) {
    case "Bee":
      trailColor = "rgba(255, 215, 0, 1)"; // Gold
      break;
    case "Firefly":
      const glow = 0.4 + 0.6 * Math.sin(this.osc * 2);
      trailColor = `rgba(200, 255, 120, ${glow})`;
      break;
    case "Butterfly":
      trailColor = getComputedStyleColor(this.color1);
      break;
  }

  if (trailColor) {
    trailParticles.push(new TrailParticle(this.x, this.y, trailColor));
  }
}

  

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(0.75, 0.75);

    switch (this.type) {
      case "Bee":
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = "rgba(230,230,255,0.4)";
        ctx.beginPath();
        ctx.ellipse(-4, -3, 3, 5, -0.4, 0, Math.PI * 2);
        ctx.ellipse(4, -3, 3, 5, 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.ellipse(0, 0, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        for (let i = -2; i <= 2; i += 2) {
          ctx.beginPath();
          ctx.moveTo(i, -3);
          ctx.lineTo(i, 3);
          ctx.stroke();
        }
        break;

      case "Firefly":
        const glow = 0.4 + 0.6 * Math.sin(this.osc * 2);
        ctx.shadowColor = `rgba(255, 255, 100, ${glow})`;
        ctx.shadowBlur = 8;

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 120, ${glow})`;
        ctx.beginPath();
        ctx.arc(4.5, 0, 2.2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "Butterfly":
        const flap = Math.sin(this.osc * 2) * 0.3;

        // Wings
        ctx.fillStyle = this.color1;
        ctx.beginPath();
        ctx.ellipse(-5, 0, 5, 7 + flap * 4, -0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(5, 0, 5, 7 + flap * 4, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Patterns
        if (this.patternType === "dots") {
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(-5, -2, 1.2, 0, Math.PI * 2);
          ctx.arc(5, 2, 1.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.patternType === "lines") {
          ctx.strokeStyle = "black";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-5, -7);
          ctx.lineTo(-5, 7);
          ctx.moveTo(5, -7);
          ctx.lineTo(5, 7);
          ctx.stroke();
        }

        // Body
        ctx.fillStyle = "#222";
        ctx.fillRect(-0.6, -4.5, 1.2, 9);
        break;
    }

    ctx.restore();
  }
}

function getComputedStyleColor(colorName) {
  const tempDiv = document.createElement("div");
  tempDiv.style.color = colorName;
  document.body.appendChild(tempDiv);
  const computedColor = getComputedStyle(tempDiv).color;
  document.body.removeChild(tempDiv);
  return computedColor.replace("rgb", "rgba").replace(")", ",1)");
}


// ============================ Toxic Gas Particle ============================
class ToxicSmokeParticle {
  constructor(x, y) {
    this.x = x * gridSize + gridSize / 2;
    this.y = y * gridSize + gridSize / 2;

    this.vx = (Math.random() - 0.5) * 0.5;
this.vy = -Math.random() * 0.1;
   this.life = this.maxLife = 60; // 2 seconds

    this.size = Math.random() * 6 + 6; // larger mist
    this.opacity = 1.0;
    this.wobble = Math.random() * Math.PI * 2;
  }

update() {
  this.x += this.vx + Math.sin(this.wobble) * 0.1;
  this.y += this.vy;
  this.life--;
  if (this.life < 0) this.life = 0;
  this.opacity = Math.max(0, Math.pow(this.life / this.maxLife, 1.8));
  this.wobble += 0.1;
}

  isAlive() {
    return this.life > 0;
  }

  draw(ctx) {
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size
    );

    gradient.addColorStop(0, `rgba(150,255,180,${this.opacity * 0.6})`);
    gradient.addColorStop(1, `rgba(50,120,60,0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
  }
}


// ================================================================= Functions =================================================================
// ============================ Explosives ============================
let nukeFlashAlpha = 0; 
const explosionRadii = {
  "Bomb": 30,          // 🔴 Red bomb explosion radius
  "Nuclear Bomb": 40   // ⚪ White nuke explosion radius
};

function updateExplosives() {
 for (let y = rows - 1; y >= 0; y--) {

    for (let x = 0; x < cols; x++) {
      const cell = grid[y][x];
      if (!cell || typeof cell === "string") continue;

      if (cell.type === "Bomb" || cell.type === "Nuclear Bomb") {
        const below = y + 1;

        // Gravity
        if (below < rows && grid[below][x] === null) {
          grid[below][x] = cell;
          grid[y][x] = null;
        } else {
          // Bomb is resting, start countdown
          cell.life--;

          if (cell.life <= 0) {
            const radius = cell.type === "Bomb" ? 20 : 40; 
           const color = cell.type === "Bomb" ? "red" : "white";


            explode(x, y, radius, color);
            grid[y][x] = null;
          }
        }
      }
    }
  }
}

function explode(cx, cy, radius, color) {
const isNuke = color === "white";

  if (isNuke) nukeFlashAlpha = 1;

  // Destroy blocks & emit particles
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;

      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= radius + Math.random() * 1.5) {
        grid[ny][nx] = null;

        const particleCount = isNuke ? 4 : 2;
       if (toxicSmokeParticles.length > 500) return; // prevent overload
if (Math.random() < 0.5) { // 50% chance to emit
  const px = nx + Math.random();
  const py = ny + Math.random();
  particleSpatters.push(new LavaSpitParticle(px, py));
}

      }
    }
  }


  // ☣️ Toxic Smoke cloud (green)

if (isNuke) {
  let smokeDuration = 100; // shorter lifespan (~10 seconds)
  const spreadRange = radius + 3;

  const interval = setInterval(() => {
    if (smokeDuration-- <= 0) {
      clearInterval(interval);
      return;
    }

   for (let i = 0; i < 5; i++) {
if (toxicSmokeParticles.length > 800) {
  clearInterval(interval);
  return;
}


      const angle = Math.random() * Math.PI * 2;
      const dist = rand(0, spreadRange) + Math.sin(Date.now() * 0.01 + i) * 1.5;
      const sx = Math.floor(cx + Math.cos(angle) * dist);
      const sy = Math.floor(cy + Math.sin(angle) * dist);

      if (sx >= 0 && sx < cols && sy >= 0 && sy < rows && grid[sy][sx] === null) {
        toxicSmokeParticles.push(new ToxicSmokeParticle(sx, sy));
      }
    }
  }, 100); // spawns every 100ms for 100 ticks = ~10 seconds
}


}

function updateToxicSmoke() {
  for (let i = toxicSmokeParticles.length - 1; i >= 0; i--) {
    toxicSmokeParticles[i].update();
    if (!toxicSmokeParticles[i].isAlive()) {
      toxicSmokeParticles.splice(i, 1); // 💀 Remove dead smoke
    }
  }
}


// ============================ Gas ============================

function updateGases() {
  for (let y = 1; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cell = grid[y][x];
      if (!cell || typeof cell !== "string" || !materials[cell]) continue;
      let type = cell;
      const mat = materials[type];
      if (!isGas(type)) continue;
      const dirs = [-1, 0, 1].sort(() => Math.random() - 0.5);
      let moved = false;
      if (grid[y - 1]?.[x] === null) {
        grid[y - 1][x] = type;
        grid[y][x] = null;
        moved = true;
      } else {
        const leftFirst = Math.random() < 0.5;
        const directions = leftFirst ? [-1, 1] : [1, -1];

        for (let dir of directions) {
          const nx = x + dir;
          if (nx >= 0 && nx < cols && grid[y - 1]?.[nx] === null) {
            grid[y - 1][nx] = type;
            grid[y][x] = null;
            moved = true;
            break;
          }
        }
        if (moved) break;
      }
      if (!grid[y][x] || typeof grid[y][x] !== "string") continue;
      if (typeof grid[y][x] === "string") {
        grid[y][x] = {
          type: type,
          life: mat.life || 100,
          color: getMaterialColor(type, x, y),
        };
      }
    }
  }
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = grid[y][x];
      if (!cell || typeof cell === "string") continue;
      const mat = materials[cell.type];
      if (!mat || !isGas(cell.type)) continue;
      cell.life--;
      if (cell.life <= 0) {
        if (mat.transform) {
          grid[y][x] = mat.transform;
        } else {
          grid[y][x] = null;
        }
      }
    }
  }
}
function updateGasParticles() {
  gasParticles.forEach((p) => p.update());
  for (let i = gasParticles.length - 1; i >= 0; i--) {
    if (!gasParticles[i].isAlive()) {
      gasParticles.splice(i, 1);
    }
  }
}

// ============================ Liquids ============================

function updateLiquids() {
  const colOrder = Array.from({ length: cols }, (_, i) => i);
  for (let i = colOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colOrder[i], colOrder[j]] = [colOrder[j], colOrder[i]];
  }

  acidBubbles.forEach((p) => p.update());
  for (let i = acidBubbles.length - 1; i >= 0; i--) {
    if (!acidBubbles[i].isAlive()) acidBubbles.splice(i, 1);
  }

  acidFog.forEach((p) => p.update());
  for (let i = acidFog.length - 1; i >= 0; i--) {
    if (!acidFog[i].isAlive()) acidFog.splice(i, 1);
  }

  particleSpatters.forEach((p) => p.update());
  for (let i = particleSpatters.length - 1; i >= 0; i--) {
    if (!particleSpatters[i].isAlive()) particleSpatters.splice(i, 1);
  }

  for (let y = rows - 2; y >= 0; y--) {
    for (let xi = 0; xi < colOrder.length; xi++) {
      const x = colOrder[xi];
      const type = grid[y][x];
      if (!type || !materials[type] || !isLiquid(type)) continue;

      if (type === "Lava" && Math.random() < 0.01) {
        particleSpatters.push(
          new LavaSpitParticle(x + Math.random(), y + Math.random())
        );
      }

      if (type === "Acid") {
        if (Math.random() < 0.005) {
          acidBubbles.push(
            new AcidBubbleParticle(x + Math.random(), y + Math.random())
          );
        }
        if (Math.random() < 0.002) {
          acidFog.push(new AcidFogParticle(x + Math.random(), y));
        }
      }

      const { speed } = materials[type];
      for (let i = 0; i < speed; i++) {
        const below = y + 1;
        if (below < rows && grid[below][x] === null) {
          grid[below][x] = type;
          grid[y][x] = null;
          break;
        }

        let moved = false;
        for (let spread = 1; spread <= 4; spread++) {
          const dirs = [-1, 1];
          for (const dir of dirs) {
            const nx = x + dir * spread;
            const by = y + 1;
            if (nx < 0 || nx >= cols) continue;

            if (grid[y][nx] === null && grid[by]?.[nx] !== null) {
              grid[y][nx] = type;
              grid[y][x] = null;
              moved = true;
              break;
            }
            if (grid[by]?.[nx] === null && grid[by]?.[x] !== null) {
              grid[by][nx] = type;
              grid[y][x] = null;
              moved = true;
              break;
            }
          }
          if (moved) break;
        }
        if (moved) break;
      }
    }
  }
}

// ============================ Powder ============================
function isPowder(type) {
  return Object.hasOwn(powderMaterials, type);
}

function updatePowders() {
  for (let y = rows - 2; y >= 0; y--) {
    for (let x = 0; x < cols; x++) {
      const type = grid[y][x];
      if (!type || !materials[type] || !isPowder(type)) continue;

      const { speed } = materials[type];
      let moved = false;

      for (let i = 0; i < speed; i++) {
        if (grid[y + 1]?.[x] === null) {
          grid[y + 1][x] = type;
          grid[y][x] = null;
          moved = true;
          break;
        }

        const dirs = Math.random() < 0.5 ? [-1, 1] : [1, -1];
        for (const dir of dirs) {
          const nx = x + dir;
          if (nx < 0 || nx >= cols) continue;

          if (grid[y + 1]?.[nx] === null) {
            grid[y + 1][nx] = type;
            grid[y][x] = null;
            moved = true;
            break;
          }
        }
        if (moved) break;
      }
    }
  }
}

const colorCache = new Map();

function getMaterialColor(type, x, y) {
  const mat = materials[type];
  if (!mat) return "#000";

  const key = `${type}_${x}_${y}`;
  if (type === "Ice" || type === "Fireworks") {
    return mat.color();
  }

  if (typeof mat.color === "function") {
    if (!colorCache.has(key)) {
      colorCache.set(key, mat.color());
    }
    return colorCache.get(key);
  }

  return mat.color;
}

// ============================Seed============================
const MAX_PLANTS = 300;
const MAX_PLANT_HEIGHT = 5;
let grownPlantCount = 0;

// Seed growth + vertical spread
function updateSeeds() {
  const radius = Math.floor(200 / gridSize);

  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = grid[y][x];
      if (!cell || cell.type !== "Seed") continue;

      const below = y + 1;
      if (grid[below]?.[x] !== "Dirt") continue;

      // Check nearby water
      let foundWater = false;
      for (let dy = -radius; dy <= radius && !foundWater; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (
            nx >= 0 && nx < cols &&
            ny >= 0 && ny < rows &&
            grid[ny][nx] === "Water"
          ) {
            foundWater = true;
            break;
          }
        }
      }

      if (!foundWater || grownPlantCount >= MAX_PLANTS) continue;

      // Grow into Grass or Flower
      const growType = Math.random() < 0.7 ? "Grass" : "Flower";
      grid[y][x] = growType;
      grownPlantCount++;

      // Vertical growth
      for (let h = 1; h <= MAX_PLANT_HEIGHT; h++) {
        const upY = y - h;
        if (upY < 0) break;
        if (grid[upY][x] === null) {
          if (Math.random() < 0.6) {
            grid[upY][x] = growType;
            grownPlantCount++;
          }
        } else {
          break;
        }
      }
    }
  }
}

// Spawn seed as object with timestamps
function spawnSeed(x, y) {
  if (x < 0 || x >= cols || y < 0 || y >= rows) return;
  if (grid[y][x] === null || grid[y][x] === undefined) {
    grid[y][x] = {
      type: "Seed",
      spawnedAt: performance.now(),
      lastMovedAt: performance.now(),
    };
  }
}

// Seeds fall down if empty cell below
function updateFallingSeeds() {
  for (let y = rows - 2; y >= 0; y--) {  // bottom up
    for (let x = 0; x < cols; x++) {
      const cell = grid[y][x];
      if (cell && cell.type === "Seed") {
        const belowCell = grid[y + 1]?.[x];
        if (belowCell === null || belowCell === undefined) {
          grid[y + 1][x] = cell;    // fall down
          grid[y][x] = null;        // vacate old spot
          cell.lastMovedAt = performance.now();
        }
      }
    }
  }
}

// Remove seeds older than 5 seconds
function removeOldSeeds() {
  const now = performance.now();
  const lifespan = 5000; // 5 seconds

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = grid[y][x];
      if (cell && cell.type === "Seed") {
        if (now - cell.spawnedAt > lifespan) {
          console.log(`Removing seed at (${x},${y}) after ${(now - cell.spawnedAt).toFixed(0)}ms`);
          grid[y][x] = null;
        }
      }
    }
  }
}

// ================================================================= Draw =================================================================

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🔥 Fire particles
  for (let i = fireParticles.length - 1; i >= 0; i--) {
    fireParticles[i].update();
    if (!fireParticles[i].isAlive()) {
      fireParticles.splice(i, 1);
    } else {
      fireParticles[i].draw(ctx);
    }
  }
trailParticles.forEach((p) => p.update());
for (let i = trailParticles.length - 1; i >= 0; i--) {
  const p = trailParticles[i];
  p.update();
  if (p.isDead()) {
    trailParticles.splice(i, 1);
  } else {
    p.draw(ctx);
  }
}
 ctx.fillStyle = "lime";
  ctx.font = "12px monospace";
  ctx.fillText(`☣️ Toxic: ${toxicSmokeParticles.length}`, 10, 20);


if (nukeFlashAlpha > 0) {
  ctx.fillStyle = `rgba(255,255,255,${nukeFlashAlpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  nukeFlashAlpha -= 0.02; // fade out
}


  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = grid[y][x];
      if (cell) {
     const matType = typeof cell === "string" ? cell : cell.type;
const mat = materials[matType];
if (!mat) continue;
const flowerColors = ["#FF69B4", "#FFD700", "#DA70D6", "#87CEEB"];

materials["Grass"] = {
  name: "Grass",
  color: () => "green"
};

materials["Flower"] = {
  name: "Flower",
  color: () => flowerColors[Math.floor(Math.random() * flowerColors.length)]
};

let color =
  typeof cell === "string"
    ? getMaterialColor(cell, x, y)
    : cell.color;

if (matType === "Bomb" || matType === "Nuclear Bomb") {
  const blink = Math.sin(Date.now() / 100) > 0 ? "#f00" : "#800";
  color = blink;
  ctx.shadowColor = blink;
  ctx.shadowBlur = 10;
}

if (mat.glow) {
  ctx.shadowColor = mat.glowColor || color;
  ctx.shadowBlur = 3;
} else {
  ctx.shadowBlur = 0;
}

ctx.fillStyle = color;
ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
if (matType === "Bomb") {
  const cx = x * gridSize + gridSize / 2;
  const cy = y * gridSize + gridSize / 2;

  ctx.beginPath();
  ctx.fillStyle = "#222";
  ctx.arc(cx, cy, gridSize * 0.8, 0, Math.PI * 2); // Bigger radius
  ctx.shadowColor = "#f00";
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Fuse
  ctx.beginPath();
  ctx.moveTo(cx, cy - gridSize * 0.9);
  ctx.lineTo(cx, cy - gridSize * 1.4);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
}
else if (matType === "Nuclear Bomb") {
  const left = x * gridSize - gridSize * 0.5;
  const top = y * gridSize - gridSize * 0.5;
  const width = gridSize * 2;
  const height = gridSize * 3;

  // Body
  ctx.beginPath();
  ctx.fillStyle = "#888";
  ctx.roundRect(left, top, width, height, 4);
  ctx.fill();

  // Nozzle glow
  ctx.beginPath();
  ctx.fillStyle = "yellow";
  ctx.moveTo(left + 4, top + height - 4);
  ctx.lineTo(left + width / 2, top + height + 6);
  ctx.lineTo(left + width - 4, top + height - 4);
  ctx.fill();

  // Fins
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(left + 4, top + 6);
  ctx.lineTo(left - 4, top - 6);
  ctx.moveTo(left + width - 4, top + 6);
  ctx.lineTo(left + width + 4, top - 6);
  ctx.stroke();

  // Glow aura
  ctx.beginPath();
  ctx.arc(left + width / 2, top + height / 2, gridSize * 2.2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 150, 0.07)";
  ctx.fill();
}
 else {
  // Regular block for everything else
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  this.beginPath();
  this.moveTo(x + r, y);
  this.lineTo(x + w - r, y);
  this.quadraticCurveTo(x + w, y, x + w, y + r);
  this.lineTo(x + w, y + h - r);
  this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  this.lineTo(x + r, y + h);
  this.quadraticCurveTo(x, y + h, x, y + h - r);
  this.lineTo(x, y + r);
  this.quadraticCurveTo(x, y, x + r, y);
  this.closePath();
};

      }
    }
  }

  gasParticles.forEach((p) => p.draw(ctx));

  particleSpatters.forEach((p) => p.draw(ctx));
  acidBubbles.forEach((p) => p.draw(ctx));
  acidFog.forEach((p) => p.draw(ctx)); 
for (let i = toxicSmokeParticles.length - 1; i >= 0; i--) {
  const p = toxicSmokeParticles[i];
  if (p.isAlive()) {
    p.draw(ctx);
  } else {
    toxicSmokeParticles.splice(i, 1); // extra safety
  }
}


  for (const p of particleSpatters) {
    ctx.beginPath();
    const shimmerOpacity = Math.random() * 0.15;
    ctx.fillStyle = `rgba(255, 160, 0, ${shimmerOpacity})`;
    const shimmerX = p.x * gridSize + rand(-2, 2);
    const shimmerY = p.y * gridSize - rand(0, 3);
    ctx.ellipse(shimmerX, shimmerY, 3, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === "Lava") {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 100, 0, 0.15)`;
        ctx.arc(x * gridSize, y * gridSize - 4, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  if (isErasing && isDrawing && mousePos) {
    const cx = Math.floor(mousePos.x / gridSize);
    const cy = Math.floor(mousePos.y / gridSize);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255, 50, 50, 0.7)";
    ctx.lineWidth = 1;
    for (let dy = -brushSize; dy <= brushSize; dy++) {
      for (let dx = -brushSize; dx <= brushSize; dx++) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
          ctx.strokeRect(nx * gridSize, ny * gridSize, gridSize, gridSize);
        }
      }
    }
  }
}
function update() {
  updateLiquids();
  updatePowders();
  updateSeeds();      
  updateGases();
  updateGasParticles();
  updateToxicSmoke(); 
  updateExplosives();
  updateFire();
   removeOldSeeds();
   updateFallingSeeds();
}


function updateFire() {
  for (let y = rows - 1; y >= 0; y--) {
    for (let x = 0; x < cols; x++) {
      const cell = grid[y][x];
      if (!cell || typeof cell === "string" || cell.type !== "Fire") continue;

      cell.life -= 1;

      if (cell.life <= 0) {
        grid[y][x] = null;
      }
    }
  }
}


function loop() {
  update();

  // 🔥 Keep spawning fire if holding mouse/touch
  if (isDrawing && selectedMaterial === "Fire" && mousePos) {
    spawnMaterial(mousePos.x, mousePos.y);
  }

  // ✨ Update fire particles
  for (let i = fireParticles.length - 1; i >= 0; i--) {
    fireParticles[i].update();
    if (!fireParticles[i].isAlive() && !isDrawing) {
      fireParticles.splice(i, 1);
    }
  }

  // 🐛 Update & cleanup insects
  for (let i = insects.length - 1; i >= 0; i--) {
    if (insects[i].life <= 0) insects.splice(i, 1);
  }


  insects.forEach(insect => insect.update());
  draw();
  insects.forEach(insect => insect.draw(ctx));

  requestAnimationFrame(loop);
}


loop();
