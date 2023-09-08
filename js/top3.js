let back;
// CSV 파일 경로
const csvFilePath = 'data/shopping_on.csv';
let topTags = []; // 상위 태그 배열 초기화
let tagImages = {}; // 태그 이미지 객체 초기화
// 전역 변수
let tagCounts;
let maleRatio;
let femaleRatio;
let ageGroupRatios; // 태그 이미지 객체를 저장할 객체

function preload() {
  back = loadImage('data/cloud.png'); // 배경이미지 파일 경로
  font = loadFont('data/NanumSquareB.ttf');
  // 상위 3개 태그 이미지 불러오기
}

function setup() {
  createCanvas(400, 400);
  loadAndProcessCSV();
  textFont(font); // 글꼴 설정

  
}

function draw() {
  background(back);
  textSize(25);
  text('현시간 구매 TOP3',115,50);
  
  // 상위 3개 태그 이미지 출력하기
  let x = 33; // 이미지 시작 위치 x 좌표
  let y = 150; // 이미지 시작 위치 y 좌표
  let imageSize = 100; // 이미지 크기
  let imageGap = 20; // 이미지 간격

  for (let i = 0; i < topTags.length; i++) {
    let tag = topTags[i];
    let tagImage = tagImages[tag];

    image(tagImage, x, y, imageSize, imageSize);
    x += imageSize + imageGap;
  }
  textSize(15);
  text(topTags,120,300);
}

// 현재 시간대를 가져오는 함수
function getTimeGroup() {
  const currentHour = new Date().getHours();

  if (currentHour >= 2 && currentHour < 6) {
    return 'A';
  } else if (currentHour >= 6 && currentHour < 10) {
    return 'B';
  } else if (currentHour >= 10 && currentHour < 14) {
    return 'C';
  } else if (currentHour >= 14 && currentHour < 18) {
    return 'D';
  } else if (currentHour >= 18 && currentHour < 22) {
    return 'E';
  } else {
    return 'F';
  }
}

// CSV 파일을 비동기적으로 로드하고 처리하는 함수
function loadAndProcessCSV() {
  const currentTimeGroup = getTimeGroup();
  // CSV 파일 로드
  const table = loadTable(csvFilePath, 'csv', 'header', function () {
    const data = table.getRows();

    // 현재 시간대에 속하는 데이터 필터링
    const filteredData = data.filter((row) => row.get('시간대').charAt(0) === currentTimeGroup);

    // 태그별 건수 합계 계산
    tagCounts = {};
    for (const row of filteredData) {
      const tag = row.get('TAG');
      const count = parseInt(row.get('건수합계'));

      if (!tagCounts[tag]) {
        tagCounts[tag] = count;
      } else {
        tagCounts[tag] += count;
      }
    }

    // 상위 3개 태그 추출
    topTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]).slice(0, 3);

    // 상위 3개 태그 이미지 불러오기
    for (const tag of topTags) {
      console.log(tag.substring(0, 1))
      let tagImage = loadImage('data/' + tag.substring(0, 1) + '.png');
      tagImages[tag] = tagImage;
    }


    // 출력
    console.log('상위 3개 태그:', topTags);
    console.log('건수 합계:', tagCounts);
    console.log('남성 비율:', maleRatio);
    console.log('여성 비율:', femaleRatio);
    console.log('연령대 비율:', ageGroupRatios);
  });
}
