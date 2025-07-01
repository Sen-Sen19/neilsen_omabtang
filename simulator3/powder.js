const powderMaterials = {
  Coal: {
    color: () => {
      const shade = 40 + rand(-10, 10);
      return `rgb(${shade}, ${shade}, ${shade})`;
    },
    speed: 1
  },
  Dirt: {
    color: () => {
      return `rgb(${110 + rand(-10, 10)}, ${100 + rand(-10, 10)}, ${50 + rand(-5, 5)})`;
    },
    speed: 1
  },
  Gunpowder: {
    color: () => {
      const shade = 100 + rand(-15, 15);
      return `rgb(${shade}, ${shade - 5}, ${shade - 10})`;
    },
    speed: 1
  },
  Sand: {
    color: () => {
      return `rgb(${230 + rand(-10, 5)}, ${200 + rand(-10, 5)}, ${130 + rand(-5, 5)})`;
    },
    speed: 1
  },
  Seed: {
    color: () => {
      return `rgb(${60 + rand(-10, 10)}, ${100 + rand(-5, 5)}, ${40 + rand(-5, 5)})`;
    },
    speed: 1
  },
  Snow: {
    color: () => {
      const c = 240 + rand(0, 15);
      return `rgb(${c}, ${c}, ${c})`;
    },
    speed: 1
  },
  Fireworks: {
    color: () => {
      const colors = ["#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f", "#fff"];
      return colors[Math.floor(Math.random() * colors.length)];
    },
    speed: 1
  }
};
