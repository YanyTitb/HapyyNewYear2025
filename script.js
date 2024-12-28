const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
const colors = [
  "#FF5733",
  "#FFBD33",
  "#DBFF33",
  "#75FF33",
  "#33FF57",
  "#33FFBD",
  "#33DBFF",
  "#5733FF",
];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 2;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.exploding = false;
    this.particles = [];
  }

  draw() {
    if (!this.exploding) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }
  }

  update() {
    if (!this.exploding) {
      this.y -= 4;
      if (random(0, 1) < 0.05) {
        this.exploding = true;
        this.explode();
      }
    }

    this.particles.forEach((particle, index) => {
      particle.update();
      if (particle.alpha <= 0) {
        this.particles.splice(index, 1);
      }
    });
  }

  explode() {
    for (let i = 0; i < 100; i++) {
      this.particles.push(new Particle(this.x, this.y, this.color));
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = random(1, 3);
    this.speed = random(1, 5);
    this.angle = random(0, Math.PI * 2);
    this.alpha = 1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.alpha -= 0.02;
    this.draw();
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (Math.random() < 0.05) {
    fireworks.push(new Firework(random(50, canvas.width - 50), canvas.height));
  }
  fireworks.forEach((firework, index) => {
    firework.update();
    firework.draw();
    if (firework.particles.length === 0 && firework.exploding) {
      fireworks.splice(index, 1);
    }
  });
  requestAnimationFrame(animate);
}

animate();
