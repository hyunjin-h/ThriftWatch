/*!
* Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

// 현재 페이지의 URL 가져오기
const currentPageUrl = window.location.href;

// 메뉴 버튼 요소들 선택하기
const menuButtons = document.querySelectorAll('nav ul li a');

// 메뉴 버튼들을 순회하며 현재 페이지와 일치하는 버튼에 표시 추가
menuButtons.forEach(button => {
  if (button.href === currentPageUrl) {
    button.classList.add('active');
  }
});