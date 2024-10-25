const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

const pointer = {
  x: width / 2,
  y: height / 2,
};

const params = {
  pointsNumber: 80, // Number of points in the web
  maxConnectionDistance: 150, // Maximum distance between points to connect
  lineWidth: 1.5,
  mouseThreshold: 120, // Distance sensitivity to mouse movement
  spring: 0.07,
  friction: 0.9,
  colorPalette: ["#888888", "#777777", "#666666", "#555555", "#444444"], // Subtle web-like greys
};

let points = [];

function setupCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener("resize", setupCanvas);

function createPoints() {
  for (let i = 0; i < params.pointsNumber; i++) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.random() - 0.5,
      vy: Math.random() - 0.5,
      spring: Math.random() * params.spring,
      color:
        params.colorPalette[
          Math.floor(Math.random() * params.colorPalette.length)
        ],
    });
  }
}

function drawConnections() {
  // Loop over each point to draw lines between them if they're close enough
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const point1 = points[i];
      const point2 = points[j];

      const dx = point1.x - point2.x;
      const dy = point1.y - point2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only draw a line if the points are within a certain distance
      if (distance < params.maxConnectionDistance) {
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${
          1 - distance / params.maxConnectionDistance
        })`;
        ctx.lineWidth = params.lineWidth;
        ctx.stroke();
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  points.forEach((point) => {
    const dx = pointer.x - point.x;
    const dy = pointer.y - point.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const force = (distance - params.mouseThreshold) * point.spring;

    if (distance < params.mouseThreshold) {
      point.vx += (dx / distance) * force;
      point.vy += (dy / distance) * force;
    }

    point.vx *= params.friction;
    point.vy *= params.friction;

    point.x += point.vx;
    point.y += point.vy;

    // GSAP animation for smooth movement
    gsap.to(point, {
      duration: 0.5,
      x: point.x + point.vx,
      y: point.y + point.vy,
      ease: "power1.out",
    });

    // Draw the point as a circle
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = point.color;
    ctx.fill();
  });

  drawConnections(); // Draw lines connecting points to create a spider-web effect

  requestAnimationFrame(draw);
}

canvas.addEventListener("mousemove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
});

createPoints();
draw();
