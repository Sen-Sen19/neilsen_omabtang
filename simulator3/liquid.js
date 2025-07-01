const liquidMaterials = {
  Water:   { color: "#00f", speed: 3 },
  Acid:    { color: "#0f0", speed: 3 },
  Alcohol: { color: "#f0f", speed: 4 },
  Lava:    { color: "#f40", speed: 1 }
};
function isLiquid(type) {
  return Object.hasOwn(liquidMaterials, type);
}
