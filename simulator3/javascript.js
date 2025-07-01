const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 6;
let cols, rows;
const grid = [];

function resizeCanvas() {
  const guiHeight = document.querySelector('.gui')?.offsetHeight || 80;
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

// Brush controls
document.getElementById("brushRange").oninput = (e) => {
  brushSize = parseInt(e.target.value);
  document.getElementById("brushValue").textContent = brushSize;
};

// Modal toggle
document.getElementById("materialToggle").onclick = () => {
  const modal = document.getElementById("materialModal");
  if (modal) modal.style.display = "flex";
};

// Modal logic
fetch('modal.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('modalContainer').innerHTML = html;
    requestAnimationFrame(() => setupModalListeners());
  });

function setupModalListeners() {
  const materialItems = document.querySelectorAll(".material-item");
  materialItems.forEach(item => {
    item.addEventListener("click", () => {
      const emoji = item.querySelector(".material-emoji")?.textContent || "?";
      const label = item.textContent.replace(/^[^\w]+/, '').trim();
      selectedMaterial = label;
      document.getElementById("materialToggle").textContent = emoji;
      document.getElementById("materialModal").style.display = "none";
    });
  });

  const modal = document.getElementById("materialModal");
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
}

// Spawn Material
function spawnMaterial(x, y) {
  const cx = Math.floor(x / gridSize);
  const cy = Math.floor(y / gridSize);
  for (let dy = -brushSize; dy <= brushSize; dy++) {
    for (let dx = -brushSize; dx <= brushSize; dx++) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        grid[ny][nx] = selectedMaterial;
      }
    }
  }
}

// Mouse & touch input
let isDrawing = false;
canvas.addEventListener("mousedown", () => isDrawing = true);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mousemove", (e) => {
  if (isDrawing && e.clientY < canvas.height) spawnMaterial(e.clientX, e.clientY);
});

canvas.addEventListener("touchstart", () => isDrawing = true);
canvas.addEventListener("touchend", () => isDrawing = false);
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const t = e.touches[0];
  if (isDrawing && t.clientY < canvas.height) spawnMaterial(t.clientX, t.clientY);
}, { passive: false });

// Global material reference
const materials = {
  ...liquidMaterials,
  ...powderMaterials,
  ...solidMaterials
};




function updateLiquids() {
  const colOrder = Array.from({ length: cols }, (_, i) => i);
  // Shuffle to avoid directional bias
  for (let i = colOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colOrder[i], colOrder[j]] = [colOrder[j], colOrder[i]];
  }

  for (let y = rows - 2; y >= 0; y--) {
    for (let xi = 0; xi < colOrder.length; xi++) {
      const x = colOrder[xi];
      const type = grid[y][x];
      if (!type || !materials[type] || !isLiquid(type)) continue;

      const { speed } = materials[type];

      for (let i = 0; i < speed; i++) {
        const below = y + 1;

        // Move straight down if possible
        if (below < rows && grid[below][x] === null) {
          grid[below][x] = type;
          grid[y][x] = null;
          break;
        }

        let moved = false;

        // Spread left and right — try up to 4 tiles wide
        for (let spread = 1; spread <= 4; spread++) {
          const dirs = [-1, 1]; // left and right
          for (let dir of dirs) {
            const nx = x + dir * spread;
            const by = y + 1;
            if (nx < 0 || nx >= cols) continue;

            // Let it spread if:
            // - The sideways tile is empty
            // - AND it has something underneath (support)
            if (grid[y][nx] === null && grid[by]?.[nx] !== null) {
              grid[y][nx] = type;
              grid[y][x] = null;
              moved = true;
              break;
            }

            // Bonus: If diagonally down is empty and directly down is blocked
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
        // Try to move straight down
        if (grid[y + 1]?.[x] === null) {
          grid[y + 1][x] = type;
          grid[y][x] = null;
          moved = true;
          break;
        }

        // Try to move diagonally down-left or down-right
        const dirs = Math.random() < 0.5 ? [-1, 1] : [1, -1];
        for (let dir of dirs) {
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

  // Skip cache for shimmer (e.g., Ice or Fireworks if you want animated sparkle)
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


// Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const mat = grid[y][x];
      if (mat && materials[mat]) {
        ctx.fillStyle = getMaterialColor(mat, x, y); // ✅ Corrected here
        ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
      }
    }
  }
}

function update() {
  updateLiquids();
  updatePowders();
}
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
