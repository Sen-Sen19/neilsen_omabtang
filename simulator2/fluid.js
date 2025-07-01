const canvas = document.getElementById('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext('2d');

const W = canvas.width, H = canvas.height;
const N = Math.floor(W/10), M = Math.floor(H/10);
const u = Array.from({length: M}, () => Array(N).fill(0));
const v = Array.from({length: M}, () => Array(N).fill(0));
const dye = Array.from({length: M}, () => Array(N).fill(0));

function splat(x, y) {
  const i = Math.floor((y/H)*M);
  const j = Math.floor((x/W)*N);
  if (i>=0 && i<M && j>=0 && j<N) {
    dye[i][j] = 255;
    const s = 5;
    for(let di=-s; di<=s; di++){
      for(let dj=-s; dj<=s; dj++){
        const ii = i+di, jj = j+dj;
        if (ii>=0&&ii<M&&jj>=0&&jj<N) {
          u[ii][jj] += (Math.random()-0.5)*50;
          v[ii][jj] += (Math.random()-0.5)*50;
          dye[ii][jj] = 200 + Math.random()*55;
        }
      }
    }
  }
}

canvas.addEventListener('mousedown', e => {
const x = e.clientX, y = e.clientY;

  splat(x,y);
  canvas.onmousemove = ev => splat(ev.clientX, ev.clientY);
});
canvas.addEventListener('mouseup', e => {
  canvas.onmousemove = null;
});

function update() {
  const u2 = JSON.parse(JSON.stringify(u));
  const v2 = JSON.parse(JSON.stringify(v));
  const dye2 = JSON.parse(JSON.stringify(dye));

  for(let i=1;i<M-1;i++){
    for(let j=1;j<N-1;j++){
      u2[i][j] = (u[i][j] + u[i][j-1] + u[i][j+1] + u[i-1][j] + u[i+1][j])/5;
      v2[i][j] = (v[i][j] + v[i][j-1] + v[i][j+1] + v[i-1][j] + v[i+1][j])/5;
      dye2[i][j] = dye[i][j] * 0.95;
    }
  }

  for(let i=0;i<M;i++){
    for(let j=0;j<N;j++){
      u[i][j] = u2[i][j];
      v[i][j] = v2[i][j];
      dye[i][j] = dye2[i][j];
    }
  }
}

function draw() {
  const img = ctx.createImageData(W, H);
  const buf = img.data;
  for(let i=0;i<M;i++){
    for(let j=0;j<N;j++){
      const c = dye[i][j];
      const x0 = j*10, y0 = i*10;
      for(let yi=0; yi<10; yi++){
        for(let xi=0; xi<10; xi++){
          const idx = ((y0+yi)*W + (x0+xi)) * 4;
          buf[idx  ] = c;
          buf[idx+1] = c*0.7;
          buf[idx+2] = 255;
          buf[idx+3] = c>5 ? 200 : 0;
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
