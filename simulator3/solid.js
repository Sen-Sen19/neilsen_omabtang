
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const solidMaterials = {
Ice: {
  color: () => {
    const r = 180 + rand(-10, 20);
    const g = 230 + rand(-20, 30);
    const b = 255;
    return `rgb(${r}, ${g}, ${b})`;
  },
  solid: true
},

  Metal: {
    color: () => {
      const shade = 120 + rand(-20, 20);
      return `rgb(${shade}, ${shade}, ${shade})`;
    },
    solid: true
  },
  Obsidian: {
    color: () => {
      return `rgb(${20 + rand(0, 10)}, ${10 + rand(0, 5)}, ${30 + rand(0, 20)})`;
    },
    solid: true
  },
  Stone: {
    color: () => {
      const shade = 100 + rand(-15, 15);
      return `rgb(${shade}, ${shade}, ${shade})`;
    },
    solid: true
  },
  Wood: {
    color: () => {
      return `rgb(${120 + rand(-10, 10)}, ${80 + rand(-10, 10)}, 40)`;
    },
    solid: true
  },
  Plant: {
    color: () => {
      return `rgb(${50 + rand(-10, 10)}, ${160 + rand(-20, 20)}, ${50 + rand(-10, 10)})`;
    },
    solid: true
  }
};
