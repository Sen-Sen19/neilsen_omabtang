export function startFluidSim(canvas) {
  const gl = canvas.getContext('webgl2');
  if (!gl) throw 'WebGL2 not supported';
  // Real fluid logic would go here (curl, divergence, pressure solve, advection, render)
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  function loop() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    requestAnimationFrame(loop);
  }
  loop();
}
