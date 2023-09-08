let back;
let img; // 이미지 객체
let ratio; // 외부에서 받아오는 비율 값 (0부터 1까지의 값)
// CSV 파일 경로
const csvFilePath = 'data/shopping_on.csv';

// 전역 변수
let topTags;
let tagCounts;
let maleRatio;
let femaleRatio;
let ageGroupRatios;



function preload() {
  back = loadImage('data/girl.png'); // 배경이미지 파일 경로
  img = loadImage('data/girl_c.png'); // 컬러이미지
  font = loadFont('data/NanumSquareB.ttf');
}

function setup() {
  createCanvas(256,256);
  loadAndProcessCSV();
  textFont(font); // 글꼴 설정
  textSize(20);
}

function draw() {
  background(back);
  ratio=femaleRatio;
  let roundedNumber = (ratio*100).toFixed(2);

  text(roundedNumber+'%',95,100);

  // 이미지를 아래에서부터 위로 자르고 출력하기
  let imgHeight = img.height * ratio;
  let offsetY = height - imgHeight;

  let srcX = 0;
  let srcY = img.height - imgHeight;
  let srcWidth = img.width;
  let srcHeight = imgHeight;

  let dstX = 0;
  let dstY = offsetY;
  let dstWidth = width;
  let dstHeight = imgHeight;

  image(img, dstX, dstY, dstWidth, dstHeight, srcX, srcY, srcWidth, srcHeight);
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

    // 남여 비율 계산
    let maleCount = 0;
    let femaleCount = 0;
    for (const row of filteredData) {
      const gender = row.get('성별');
      if (gender === 'M') {
        maleCount++;
      } else if (gender === 'F') {
        femaleCount++;
      }
    }
    const totalGenderCount = maleCount + femaleCount;
    maleRatio = maleCount / totalGenderCount;
    femaleRatio = femaleCount / totalGenderCount;

    // 연령대 비율 계산
    const ageGroups = ['A', 'B', 'C', 'D', 'E'];
    const ageGroupCounts = {};
    for (const ageGroup of ageGroups) {
      ageGroupCounts[ageGroup] = 0;
    }
    for (const row of filteredData) {
      const ageGroup = row.get('연령대').charAt(0);
      ageGroupCounts[ageGroup]++;
    }

    const totalAgeCount = filteredData.length;
    ageGroupRatios = {};
    for (const ageGroup of ageGroups) {
      const ratio = ageGroupCounts[ageGroup] / totalAgeCount;
      ageGroupRatios[ageGroup] = ratio;
    }

    // 출력
    console.log('상위 3개 태그:', topTags);
    console.log('건수 합계:', tagCounts);
    console.log('남성 비율:', maleRatio);
    console.log('여성 비율:', femaleRatio);
    console.log('연령대 비율:', ageGroupRatios);
  });
}