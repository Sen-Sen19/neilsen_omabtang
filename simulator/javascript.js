// ========================For Electric and Fire only========================
function stopHolding() {
  isMouseDown = false;
  if (holdInterval) {
    clearInterval(holdInterval);
    holdInterval = null;
  }
}





// ========================Bombs Behavior========================
function simulateBombs() {
  const bombTypes = ["bomb", "nuclear bomb"];
  for (let y = ROWS - 2; y >= 0; y--) {
    for (let x = 0; x < COLS; x++) {
      const cell = grid[y][x];
      if (!cell || !bombTypes.includes(cell.type)) continue;

      if (!grid[y + 1][x]) {
        grid[y + 1][x] = cell;
        grid[y][x] = null;
      }
    }
  }
}

// ========================Powder Behavior========================
     function simulatePowder() {
        const powderTypes = [
          "coal powder",
          "dirt",
          "fireworks",
          "gunpowder",
          "salt",
          "sand",
          "seed",
          "snow",
        ];

        for (let y = ROWS - 2; y >= 0; y--) {
          for (let x = 0; x < COLS; x++) {
            const cell = grid[y][x];
            if (!cell || !powderTypes.includes(cell.type)) continue;

            // Fall down
            if (!grid[y + 1][x]) {
              grid[y + 1][x] = cell;
              grid[y][x] = null;
              continue;
            }

            // Try diagonals
            const dirs = [-1, 1].sort(() => Math.random() - 0.5);
            for (const dx of dirs) {
              const nx = x + dx;
              if (nx >= 0 && nx < COLS && !grid[y + 1][nx]) {
                grid[y + 1][nx] = cell;
                grid[y][x] = null;
                break;
              }
            }
          }
        }
      }
// ========================Fluid Behavior========================
 

function simulateFluid() {
  const fluidTypes = ["water", "lava", "acid", "alcohol", "plasma", "magma"];
  const hasMoved = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

  for (let y = ROWS - 2; y >= 0; y--) {
    for (let x = 0; x < COLS; x++) {
      const cell = grid[y][x];
      if (!cell || !fluidTypes.includes(cell.type)) continue;
      if (hasMoved[y][x]) continue;

      const isSticky = cell.type === "magma";
      const fallChance = isSticky ? 0.3 : 1.0; // magma falls slower

      // Try falling straight down
      if (!grid[y + 1][x] && Math.random() < fallChance) {
        grid[y + 1][x] = cell;
        grid[y][x] = null;
        hasMoved[y + 1][x] = true;
        continue;
      }

      // Diagonal flow
      const dirs = [-1, 1].sort(() => Math.random() - 0.5);
      let moved = false;
      for (const dx of dirs) {
        const nx = x + dx;
        if (
          nx >= 0 &&
          nx < COLS &&
          !grid[y + 1][nx] &&
          Math.random() < fallChance
        ) {
          grid[y + 1][nx] = cell;
          grid[y][x] = null;
          hasMoved[y + 1][nx] = true;
          moved = true;
          break;
        }
      }
      if (moved) continue;

      // Spread sideways (stickier means less distance)
      const maxSpread = isSticky ? 1 : 3;
      for (const dx of dirs) {
        const nx = x + dx;
        if (nx >= 0 && nx < COLS && !grid[y][nx]) {
          let fallY = y;
          let spreadSteps = 0;
          while (
            fallY + 1 < ROWS &&
            !grid[fallY + 1][nx] &&
            spreadSteps < maxSpread
          ) {
            fallY++;
            spreadSteps++;
          }
          grid[fallY][nx] = cell;
          grid[y][x] = null;
          hasMoved[fallY][nx] = true;
          break;
        }
      }
    }
  }
}


// ========================Fire Behavior========================
function drawFireBurst(x, y) {
  const particles = 10 + Math.floor(Math.random() * 10);
  ctx.save();
  ctx.shadowColor = "rgba(255, 100, 0, 0.8)";
  ctx.shadowBlur = 20;

  for (let i = 0; i < particles; i++) {
    const offsetX = (Math.random() - 0.5) * CELL_SIZE * 3;
    const offsetY = (Math.random() - 0.5) * CELL_SIZE * 3;
    const flameR = 255;
    const flameG = Math.floor(80 + Math.random() * 170);
    const flameB = Math.floor(Math.random() * 30);
    const alpha = 0.7 + Math.random() * 0.3;

    ctx.beginPath();
    ctx.fillStyle = `rgba(${flameR}, ${flameG}, ${flameB}, ${alpha})`;
    ctx.arc(x + offsetX, y + offsetY, Math.random() * 3 + 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}


// ========================Electric Behavior========================
function drawElectricBolt(x, y) {
  const length = 5 + Math.random() * 5;
  const angle = Math.random() * Math.PI * 2;
  const segments = 3 + Math.floor(Math.random() * 2);

  let prevX = x;
  let prevY = y;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);

  for (let i = 0; i < segments; i++) {
    const offsetAngle = angle + (Math.random() - 0.5) * 1.2;
    const dx = Math.cos(offsetAngle) * length;
    const dy = Math.sin(offsetAngle) * length;
    const nextX = prevX + dx;
    const nextY = prevY + dy;

    ctx.lineTo(nextX, nextY);
    prevX = nextX;
    prevY = nextY;
  }

  // ⚡ Mostly electric blue, sometimes white
  const useWhite = Math.random() < 0.4;
  const glowColor = useWhite ? "#ffffff" : "#33ccff"; // crisp blue with white snap

  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 1.5 + Math.random() * 0.5;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 20 + Math.random() * 10;

  ctx.stroke();
  ctx.restore();

  // ⚡ Flash dot at origin
  ctx.beginPath();
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.arc(x, y, 1.5 + Math.random(), 0, Math.PI * 2);
  ctx.fill();
}

// ========================Gas Behavior========================

   
function simulateGasLikeParticles() {
  const newGrid = grid.map(row => row.slice());

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = grid[y][x];
      if (!cell || !["steam", "smoke", "gas"].includes(cell.type)) continue;

      const dirs = [
        { dx: 0, dy: -1 },
        { dx: -1, dy: -1 },
        { dx: 1, dy: -1 },
      ];

      for (let i = dirs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
      }

      let moved = false;
      for (const { dx, dy } of dirs) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && !grid[ny][nx]) {
          if (cell.type === "steam") {
            if (ny === 0 && Math.random() < 0.3) {
              newGrid[ny][nx] = { type: "water" };
            } else if (Math.random() < 0.01) {
              newGrid[ny][nx] = { type: "water" };
            } else {
              newGrid[ny][nx] = cell;
            }
          } else if (cell.type === "smoke") {
            let newOpacity = (cell.opacity ?? 1) - (Math.random() * 0.02 + 0.01); // Random fade rate
            if (newOpacity <= 0.05 || (ny === 0 && Math.random() < 0.5)) {
              newGrid[y][x] = null; // Fully vanish
              moved = true;
              break;
            } else {
              newGrid[ny][nx] = { type: "smoke", opacity: newOpacity };
            }
          } else {
            newGrid[ny][nx] = cell;
          }

          newGrid[y][x] = null;
          moved = true;
          break;
        }
      }

      // Stuck steam at ceiling may condense
      if (!moved && cell.type === "steam" && y === 0 && Math.random() < 0.3) {
        newGrid[y][x] = { type: "water" };
      }

      // Smoke stuck or not moving still fades
      if (!moved && cell.type === "smoke") {
        let newOpacity = (cell.opacity ?? 1) - (Math.random() * 0.02 + 0.01);
        if (newOpacity <= 0.05 || (y === 0 && Math.random() < 0.5)) {
          newGrid[y][x] = null;
        } else {
          newGrid[y][x] = { type: "smoke", opacity: newOpacity };
        }
      }
    }
  }

  grid = newGrid;
}

