let cx, cy;
let secondsRadius;
let minutesRadius;
let hoursRadius;
let clockDiameter;

function setup() {
  let canvas=createCanvas(720,720);
  canvas.parent('#watch');
  stroke(255);

  let radius = min(width, height) / 3;
  secondsRadius = radius * 0.71;
  minutesRadius = radius * 0.6;
  hoursRadius = radius * 0.5;
  clockDiameter = radius * 1.7;

  cx = width / 2;
  cy = height / 2;
}

function draw() {
  background(0,0,0,0);

  // 시계 배경 그리기
  noStroke();
  fill(44);
  ellipse(cx, cy, clockDiameter + 50, clockDiameter + 50);
  fill(255);
  ellipse(cx, cy, clockDiameter, clockDiameter);

  // sin()과 cos()의 각도는 3시 정각에서 시작;
  // HALF_PI를 뺄셈하여 상단에서부터 시작하도록 설정
  let s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
  let m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
  let h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;

  // 시계침들 그리기
  stroke(255,153,0);
  strokeWeight(8);
  line(cx, cy, cx + cos(s) * secondsRadius, cy + sin(s) * secondsRadius);
  stroke(0);
  strokeWeight(11);
  line(cx, cy, cx + cos(m) * minutesRadius, cy + sin(m) * minutesRadius);
  strokeWeight(13);
  line(cx, cy, cx + cos(h) * hoursRadius, cy + sin(h) * hoursRadius);

  // 분침 그리기
  strokeWeight(2);
  beginShape(POINTS);
  for (let a = 0; a < 360; a += 6) {
    let angle = radians(a);
    let x = cx + cos(angle) * secondsRadius;
    let y = cy + sin(angle) * secondsRadius;
    vertex(x, y);
  }
  endShape();
}