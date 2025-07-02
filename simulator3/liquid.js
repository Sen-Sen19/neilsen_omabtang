
const liquidMaterials = {
  Water: {
    color: () => {
      const r = 0;
      const g = 0 + rand(0, 20); // shimmer
      const b = 200 + rand(0, 55);
      return `rgb(${r},${g},${b})`;
    },
    speed: 3,
    glow: false
  },
  Acid: {
    color: () => {
      const r = 100 + rand(0, 30);
      const g = 255;
      const b = 50 + rand(0, 20);
      return `rgb(${r},${g},${b})`;
    },
    speed: 3,
    glow: true,
    glowColor: "lime"
  },
  Alcohol: {
    color: () => {
      const r = 200 + rand(0, 40);
      const g = 100 + rand(0, 40);
      const b = 200 + rand(0, 40);
      return `rgb(${r},${g},${b})`;
    },
    speed: 4,
    glow: false
  },
  Lava: {
  color: () => {
    const r = 255;
    const g = 80 + rand(-20, 20);
    const b = 0;
    return `rgb(${r},${g},${b})`;
  },
  speed: 1,
  viscosity: 4,   // custom thickness value
  glow: true,
  glowColor: "rgba(255, 100, 0, 0.8)"
}

};

function isLiquid(type) {
  return Object.hasOwn(liquidMaterials, type);
}
