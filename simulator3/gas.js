const gasMaterials = {
  Steam: {
    color: () => `rgba(200, 200, 255, ${Math.random() * 0.3 + 0.2})`,
    speed: 1,
    gas: true,
    disperses: true,
    transform: "Water", // turns into water
    life: 100 // life ticks before transform
  },
  Gas: {
    color: () => `rgba(160, 255, 160, ${Math.random() * 0.2 + 0.1})`,
    speed: 1,
    gas: true,
    disperses: true,
    transform: null,
    life: 100 // will fade out
  }
};
