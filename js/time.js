let table;
let summedData = {
  'A': 0,
  'B': 0,
  'C': 0,
  'D': 0,
  'E': 0,
  'F': 0
};
let font;
let maxDay; // 최대값을 가진 요일
let maxValue = 0; // 최대값

let amt, startColor, newColor, CColor;
let starImage; // 별표 이미지
let sum = 0;
let today;

function preload() {
  table = loadTable('data/shopping_on.csv', 'csv', 'header');
  font = loadFont('data/NanumSquare_acR.ttf');
  fontB = loadFont('data/NanumSquareB.ttf');
}

function setup() {
  createCanvas(600,400);

  startColor = color(245, 153, 0);
  newColor = color(255, 230, 175);
  amt = 0;


  today = new Date().getDay();

  // 행 순회
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);
    let day = row.getString('시간대');
    let value = day.charAt(0);
    let count = row.getNum('건수합계');

    summedData[value] += count;
  }

  for (let day in summedData) {
    sum += summedData[day];
  }
  console.log(sum);
}

function draw() {

  let graphWidth = width - 100;
  let graphHeight = height - 100;
  let maxValue = Math.max(...Object.values(summedData));
  let minValue = Math.min(...Object.values(summedData));

  background(255);
  textFont(fontB); // 글꼴 설정
  textSize(25);
   textFont(font); 
   textSize(20);

  // 그래프 그리기
  let x = 70;
  let y = height - 50;

  // Y 축 그리기
  stroke(0);
  line(x, y, x, 50);
  line(x+graphWidth, y, x+graphWidth, 50);
  noStroke();

  // Y 축 레이블 그리기
  textAlign(RIGHT, CENTER);
  textSize(20);
  let yLabels = [0, minValue, maxValue];
  for (let i = 0; i < yLabels.length; i++) {
    let yPos = map(yLabels[i], 0, maxValue, y, 50);
    noStroke();
    text(Math.ceil((yLabels[i] / sum) * 100) + '%', x - 10, yPos);
    stroke(2);
    line(x, yPos, x + graphWidth, yPos);
  }

  // X 축 그리기
  stroke(0);
  line(x, y, x + graphWidth, y);
  noStroke();

  // 꺾은선 그래프 그리기
  let numDataPoints = Object.keys(summedData).length;
  let stepSize = graphWidth / (numDataPoints - 1);
  let xPos = x;
  let prevX = x;
  let prevY = map(summedData['A'], 0, maxValue, y, 50);

  for (let i = 0; i < numDataPoints; i++) {
    let day = Object.keys(summedData)[i];
    let count = summedData[day];
    let yPos = map(count, 0, maxValue, y, 50);
    strokeWeight(9);
    // 점 그리기
    fill(0);
    ellipse(xPos, yPos, 6);
strokeWeight(4);
    // 선 그리기
    stroke(0);

    line(prevX, prevY, xPos, yPos);

    prevX = xPos;
    prevY = yPos;

    xPos += stepSize;
  }
 strokeWeight(1);
  // X 축 레이블 그리기
  textAlign(CENTER, TOP);
  fill(0);
  noStroke();
  textSize(20);
  for (let i = 0; i < numDataPoints; i++) {
    let day = Object.keys(summedData)[i];
    let xPos = x + i * stepSize;
    text(i*4+2+'시', xPos, y + 10);
  }
}