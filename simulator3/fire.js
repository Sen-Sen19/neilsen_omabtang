const fireMaterials = {
  Fire: {
    color: () => `rgba(255, ${rand(80,150)}, 0, 0.9)`,
    speed: 1,
    life: 20 + Math.random() * 30,
    glow: true,
    glowColor: "orange",
  },
};
