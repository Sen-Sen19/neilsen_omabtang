// === AI Car Arena (All-in-One JavaScript) ===

const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - document.querySelector(".gui").offsetHeight;

// === Constants ===
const NUM_CARS = 10;
const CAR_RADIUS = 10;
const FOOD_RADIUS = 8;
const WEAPON_LENGTH = 15;
const COLORS = [
  '#ffd1dc', '#a0e7e5', '#b4f8c8', '#fbe7c6', '#cdb4db',
  '#ffc8dd', '#caffbf', '#d0f4de', '#ffcbf2', '#b5ead7'
];

let food = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };

// === Car Class ===
class Car {
  constructor(id, color) {
    this.id = id;
    this.color = color;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.angle = Math.random() * Math.PI * 2;
    this.points = 0;
    this.hp = 3;
    this.brain = this.createBrain();
    this.inputs = [0, 0];
  }

  createBrain() {
    return tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [2], units: 6, activation: 'relu' }),
        tf.layers.dense({ units: 2, activation: 'tanh' })
      ]
    });
  }

  think() {
    const dx = food.x - this.x;
    const dy = food.y - this.y;
    const input = tf.tensor2d([[dx, dy]]);
    const output = this.brain.predict(input);
    const data = output.dataSync();
    this.angle += data[0] * 0.1;
    const speed = data[1] * 2;
    this.x += Math.cos(this.angle) * speed;
    this.y += Math.sin(this.angle) * speed;
    input.dispose();
    output.dispose();
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, CAR_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Draw weapon
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(WEAPON_LENGTH, 0);
    ctx.stroke();
    ctx.restore();
  }

  checkCollision(other) {
    if (this === other || this.hp <= 0 || other.hp <= 0) return;

    // Weapon tip position
    const wx = this.x + Math.cos(this.angle) * WEAPON_LENGTH;
    const wy = this.y + Math.sin(this.angle) * WEAPON_LENGTH;

    const dx = other.x - wx;
    const dy = other.y - wy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < CAR_RADIUS) {
      other.hp--;
      this.points += 2;
      if (other.hp <= 0) {
        other.respawn();
        this.points += 5;
      }
    } else {
      // Check weapon to weapon collision
      const otherWX = other.x + Math.cos(other.angle) * WEAPON_LENGTH;
      const otherWY = other.y + Math.sin(other.angle) * WEAPON_LENGTH;
      const weaponDist = Math.hypot(wx - otherWX, wy - otherWY);
      if (weaponDist < 10) {
        this.hp--;
        other.hp--;
        if (this.hp <= 0) this.respawn();
        if (other.hp <= 0) other.respawn();
      }
    }
  }

  respawn() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.hp = 3;
    this.points = Math.max(0, this.points - 10);
  }
}

const cars = Array.from({ length: NUM_CARS }, (_, i) => new Car(`Car_${i + 1}`, COLORS[i]));
let bestCar = null;

function drawFood() {
  ctx.fillStyle = '#ffa';
  ctx.beginPath();
  ctx.arc(food.x, food.y, FOOD_RADIUS, 0, Math.PI * 2);
  ctx.fill();
}

function checkFoodPickup(car) {
  const dx = car.x - food.x;
  const dy = car.y - food.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < CAR_RADIUS + FOOD_RADIUS) {
    car.points += 10;
    food = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
  }
}

function updateLeaderboard() {
  cars.sort((a, b) => b.points - a.points);
  bestCar = cars[0];
  document.getElementById("leaderboard").innerHTML =
    '<h3>Leaderboard</h3>' +
    cars.map(car => `<div style="color:${car.color}; font-weight:${car === bestCar ? 'bold' : 'normal'}">${car.id} - ${car.points}pts (HP: ${car.hp})</div>`).join('');
}

function resetGame() {
  cars.forEach(car => car.respawn());
  food = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
}

function evolveBrains() {
  const bestWeights = bestCar.brain.getWeights().map(w => w.clone());
  cars.forEach(car => {
    if (car !== bestCar) {
      car.brain.setWeights(bestWeights.map(w => w.clone()));
    }
  });
  bestWeights.forEach(w => w.dispose());
  console.log("Brains evolved from:", bestCar.id);
}

setInterval(evolveBrains, 60 * 60 * 1000); // Every hour

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  cars.forEach(car => car.think());
  for (let i = 0; i < cars.length; i++) {
    for (let j = 0; j < cars.length; j++) {
      cars[i].checkCollision(cars[j]);
    }
  }
  cars.forEach(car => {
    checkFoodPickup(car);
    if (car === bestCar) ctx.shadowColor = car.color;
    car.draw();
    ctx.shadowColor = "transparent";
  });
  updateLeaderboard();
  requestAnimationFrame(animate);
}

animate();