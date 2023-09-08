let back;
// CSV 파일 경로
const csvFilePath = 'data/shopping_on.csv';

// 전역 변수
let topTags;
let tagCounts;
let maleRatio;
let femaleRatio;
let ageGroupRatios;
let tagImages = {}; // 태그 이미지 객체를 저장할 객체

function preload() {
  back = loadImage('data/cloud.png'); // 배경이미지 파일 경로
  font = loadFont('data/NanumSquareB.ttf');
  // 상위 3개 태그 이미지 불러오기
}

function setup() {
  createCanvas(400,256);
  loadAndProcessCSV();
  textFont(font); // 글꼴 설정
  textSize(15);

}

function draw() {
  background(255);
  textAlign(CENTER);
  
  if (ageGroupRatios) {
    // 연령대 비율 텍스트 출력하기
    textSize(18);
    fill(0); 
    textAlign(CENTER);

    let ageTextX = width / 2+60;
    let ageTextY = height - 30;

    const ageGroups = Object.keys(ageGroupRatios);

    for (let i = ageGroups.length - 1; i >= 0; i--) {
      const ageGroup = ageGroups[i];
      const ratio = ageGroupRatios[ageGroup];
      const percentage = (ratio * 100).toFixed(1);

      const ageText = getAgeText(ageGroup);
      const ratioText = `${ageText}: ${percentage}%`;
      text(ratioText, ageTextX, ageTextY);
      ageTextY -= 20;
    }
  }
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
function getAgeText(ageGroup) {
    switch (ageGroup) {
      case 'A':
        return '20대';
      case 'B':
        return '30대';
      case 'C':
        return '40대';
      case 'D':
        return '50대';
      case 'E':
        return '60대 이상';
      default:
        return ageGroup;
    }
  }