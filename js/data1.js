let table;
let summedData = {
  '일': 0,
  '월': 0,
  '화': 0,
  '수': 0,
  '목': 0,
  '금': 0,
  '토': 0
};
let font;
let maxDay; // 최대값을 가진 요일
let maxValue = 0; // 최대값

let amt, startColor, newColor,CColor;
let starImg; // 별표 이미지
let sum = 0;
let today;
function preload() {
  table = loadTable('../data/shopping_on.csv', 'csv', 'header');
  starImg = loadImage('../data/star.png'); // 별표 이미지 파일 경로로 변경
  font=loadFont('../data/NanumSquare_acR.ttf');
}
function setup() {
  let canvas=createCanvas(800, 500);
  canvas.parent('#visual1');
 
  startColor = color(245,153,0);
  newColor = color(255,230,175);
  amt = 0;
  textFont(font); // 글꼴 설정
  textSize(20);
  
  today = new Date().getDay();

  // 행 순회
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);
    let day = row.getString('요일');
    let count = row.getNum('건수합계');

    summedData[day] += count;
  }

  for (let day in summedData) {
    sum += summedData[day];
  }
  console.log(sum)

}
function draw(){
  let barWidth = (width - 100) / Object.keys(summedData).length -20;
  let maxValue = Math.max(...Object.values(summedData));
  let barSpacing = 10; // 막대 간격 크기
  noStroke();


// 그래프 그리기
  let x = 70;
  let y = height - 50;
   // Y 축 그리기
  stroke(0);
  line(x, y, x, 50);
     // Y 축 그리기
  stroke(0);
  let graphWidth=(barWidth + barSpacing) * Object.keys(summedData).length+10;
  line(x+graphWidth, y, x+graphWidth, 50);
  noStroke();

  // Y 축 레이블 그리기
  textAlign(RIGHT, CENTER);
  textSize(20);
  let yLabels = [0, maxValue *(1/3), maxValue*(2/3), maxValue];
  for (let i = 0; i < yLabels.length; i++) {
    let yPos = map(yLabels[i], 0, maxValue, y, 50);
    noStroke();
    text(Math.ceil((yLabels[i]/sum)*100)+'%', x - 10, yPos);
    stroke(2);
    line(x, yPos, x+graphWidth, yPos);
  }

  // X 축 그리기
  stroke(0);
  line(x, y, x+graphWidth, y);
  noStroke();
  for (let i = 0; i < Object.keys(summedData).length; i++) {
    let day = Object.keys(summedData)[i];
    let count = summedData[day];
    let xPos = x + i * (barWidth+barSpacing);
    let barHeight = map(count, 0, maxValue, 0, y - 50);

    // 오늘인 막대 반짝이게 하기
    if (i === today) {
      noStroke();
      fill(startColor);
      fill(lerpColor(startColor, newColor, amt));
      amt += 0.01;
      if(amt >= 1){
        amt = 0.003;
        CColor=startColor;
        startColor = newColor;
        newColor = CColor;
      }
    } else {
      fill(80);
    }

    // 막대 그리기
    rect(xPos+10, y - barHeight, barWidth, barHeight,20,20,0,0);
  }

  // 최대값인 막대에 별표와 'max' 단어 표시
  let maxIndex = Object.values(summedData).indexOf(maxValue);
  let maxBarX = x + maxIndex * barWidth+10;
  let maxBarHeight = map(maxValue, 0, maxValue, 0, y - 50);

  fill(0);
  textAlign(CENTER, BOTTOM);
  textSize(18);
  text('최대', maxBarX + barWidth / 2+10, y - maxBarHeight - 10);
  image(starImg, maxBarX + (barWidth) / 2 +30, y - maxBarHeight - 40, 30,30);


  textAlign(CENTER, TOP);
  fill(0);
  noStroke();
  textSize(20);
  for (let i = 0; i < Object.keys(summedData).length; i++) {
    let day = Object.keys(summedData)[i];
    let xPos = x + i *( barWidth+barSpacing) + barWidth / 2+10;
    text(day, xPos, y + 10);
  }
}
