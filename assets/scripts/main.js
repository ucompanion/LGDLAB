'use strict';

let x;
let dragFinished = false;
let ready = false;
const scenes = ['introduce', 'program', 'location'];
let selectedScene;
let selectedSceneName;
const fullpageConfig = {
  introduce: {
    backgroundColor: [
      'transparent',
      'pink',
      '#121212',
      'yellow',
      'skyblue',
      '#fff',
    ],
  },
  program: {
    backgroundColor: ['transparent', '#fff', '#121212', '#fff', '#fff', '#fff'],
  },
  location: {
    backgroundColor: ['transparent', 'salmon', 'green', 'gray', '#fff'],
  },
};
let shownQuickMenu = false;
let gnbShown = false;

function nextScene() {
  $('#scene1').hide();
  $('#scene2').show();

  $('.slide-nav')
    .slick({
      centerMode: true,
      centerPadding: '25vw',
      arrows: false,
      slidesToShow: 1,
      focusOnSelect: true,
    })
    .on('afterChange', (event, slick, currentSlide) => {
      ready && changeMenu(currentSlide);
    });
}

function selectScene(sceneName) {
  if (!sceneName) {
    return;
  }

  selectedSceneName = sceneName;
  const item = document.getElementById(sceneName + '-scene');

  if (!item) {
    return;
  }
  if (selectedScene) {
    selectedScene.classList.remove('selected');
    const parent = document.querySelector('.background-animation');
    parent && parent.classList.remove('background-animation');
  }
  selectedScene = item;
  item.classList.add('selected');

  $('.slide-nav').slick('slickGoTo', sceneName === 'introduce' ? 0 : 1);

  setTimeout(() => {
    fullScreenScene();
  }, 500);
}

function fullScreenScene() {
  const item = document.getElementById('split');
  item.classList.add('ready');
  ready = true;
}

function contentsScene() {
  $(window).off('wheel');
  $(window).off('touchmove');
  const items = document.querySelectorAll('.shown-bar');
  items.forEach((element) => {
    element.classList.remove('hidden');
  });
  activateFullpage();
}

function changeMenu(index) {
  const name = scenes[index];
  selectScene(name);
  activateFullpage();
}

function activateFullpage() {
  $('#scene2 .section').not(':first-child').remove();
  const templateContents = $('#template-contents-' + selectedSceneName).clone();
  const templateFooter = $('#template-footer').clone();
  $('#scene2')
    .removeClass(
      scenes.map((s) => {
        return 'fullpage-' + s;
      })
    )
    .addClass('fullpage-' + selectedSceneName)
    .append(templateContents.html() + templateFooter.html());

  $('#split').addClass('shrunken');

  selectedSceneName === 'program' && carouselCinema();

  $.fn.fullpage.destroy && $.fn.fullpage.destroy('all');

  const backgroundColor = fullpageConfig[selectedSceneName].backgroundColor;

  $('#scene2').fullpage({
    //options here
    autoScrolling: true,
    verticalCentered: false,
    css3: true,
    sectionsColor: backgroundColor,
    navigation: false,
    afterLoad: function (anchorLink, index) {
      console.log('afterLoad', anchorLink, index);
      $('.header').removeClass('account-bar-blind');
      if (index === 1) {
        $('.slide-nav').removeClass('hidden');
        $('.header').removeClass('hidden').addClass('header-bg-white');
        $('#quick-menu').hide(300);
      }
      if (backgroundColor[index - 1] === '#121212') {
        $('.header').addClass('page-bg-dark');
      }
      if (index > 1) {
        $('#quick-menu').show(300);
      }
      // anchorLink == 'footer' && $('#quick-menu').hide(300);
    },
    onLeave: function (index, nextIndex, direction) {
      console.log('onLeave', index, nextIndex, direction);
      if (index === 1) {
        $('.slide-nav').addClass('hidden');
        $('.header').removeClass('header-bg-white');
        $('.header').addClass('account-bar-blind');
      }
      if (backgroundColor[index - 1] === '#121212') {
        $('.header').removeClass('page-bg-dark');
        direction == 'down' && $('.header').addClass('account-bar-blind');
      }
      if (
        (nextIndex === 1 || backgroundColor[nextIndex - 1] === '#121212') &&
        direction == 'up'
      ) {
        $('.header').addClass('account-bar-blind');
      }
    },
  });

  //methods
  $.fn.fullpage.setAllowScrolling(true);
}

function init() {
  // window.addEventListener('wheel', () => {
  //   ready && contentsScene();
  // });

  $(window).on('wheel', () => {
    ready && contentsScene();
  });
  $(window).on('touchmove', () => {
    ready && contentsScene();
  });
  $('#quick-menu .btn').click(() => {
    shownQuickMenu = !shownQuickMenu;
    // if (shownQuickMenu) {
    //   $('#quick-menu').addClass('active');
    // } else {
    //   $('#quick-menu').removeClass('active');
    // }

    shownQuickMenu
      ? $('#quick-menu').addClass('active')
      : $('#quick-menu').removeClass('active');
  });

  $('#btn-gnb').click(() => {
    if (gnbShown) {
      $('#gnb-container').hide();
      gnbShown = false;
      $.fn.fullpage && $.fn.fullpage.setAllowScrolling(true);
    } else {
      $('#gnb-container').show();
      gnbShown = true;
      $.fn.fullpage && $.fn.fullpage.setAllowScrolling(false);
    }
  });
}

function carouselCinema() {
  const slide = new Swiper('#carousel-grab', {
    effect: 'coverflow',
    grabCursor: false,
    loop: true,
    loopAdditionalSlides: 1,
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 0,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 50,
      modifier: 1,
      slideShadows: true,
    },
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    autoplay: false,
  });
}

function goToTop() {
  $.fn.fullpage.moveTo(1);
}

// intro
function dragStart(event) {
  event.dataTransfer.setData('drag', event.clientX);
  x = event.clientX;
}

function touchStart(event) {
  x = event.changedTouches[0].clientX;
}

function dragging(event) {
  const img = document.getElementById('img-drag');
  const { clientX } = event;

  if (x + 20 >= clientX && clientX <= x + 40) {
    img.src = './assets/images/intro/img2.png';
  } else if (x + 40 > clientX && clientX <= x + 60) {
    img.src = './assets/images/intro/img3.png';
  } else if (x + 60 > clientX && clientX <= x + 80) {
    img.src = './assets/images/intro/img4.png';
  } else if (x + 80 > clientX && clientX <= x + 100) {
    img.src = './assets/images/intro/img5.png';
  } else if (x + 100 > clientX && clientX <= x + 120) {
    img.src = './assets/images/intro/img6.png';
  } else if (x + 120 > clientX && clientX <= x + 140) {
    img.src = './assets/images/intro/img7.png';
  } else if (x + 140 > clientX && clientX <= x + 160) {
    img.src = './assets/images/intro/img8.png';
  } else if (x + 160 > clientX && clientX <= x + 180) {
    img.src = './assets/images/intro/img9.png';
  } else if (x + 180 > clientX && clientX <= x + 200) {
    img.src = './assets/images/intro/img10.png';
  } else if (x + 200 > clientX && clientX <= x + 220) {
    img.src = './assets/images/intro/img11.png';
  } else if (x + 220 > clientX && clientX <= x + 240) {
    img.src = './assets/images/intro/img12.png';
    dragFinished = true;
  } else if (x + 240 > clientX && clientX <= x + 260) {
    img.src = './assets/images/intro/img13.png';
  } else if (x + 260 > clientX && clientX <= x + 280) {
    img.src = './assets/images/intro/img14.png';
  } else if (x + 280 > clientX && clientX <= x + 300) {
    img.src = './assets/images/intro/img15.png';
  } else if (x + 300 > clientX && clientX <= x + 320) {
    img.src = './assets/images/intro/img16.png';
  } else if (x + 320 > clientX && clientX <= x + 340) {
    img.src = './assets/images/intro/img17.png';
  }
}
function touchMove(event) {
  const img = document.getElementById('img-drag');
  const { clientX } = event.changedTouches[0];

  if (x + 20 >= clientX && clientX <= x + 40) {
    img.src = './assets/images/intro/img2.png';
  } else if (x + 40 > clientX && clientX <= x + 60) {
    img.src = './assets/images/intro/img3.png';
  } else if (x + 60 > clientX && clientX <= x + 80) {
    img.src = './assets/images/intro/img4.png';
  } else if (x + 80 > clientX && clientX <= x + 100) {
    img.src = './assets/images/intro/img5.png';
  } else if (x + 100 > clientX && clientX <= x + 120) {
    img.src = './assets/images/intro/img6.png';
  } else if (x + 120 > clientX && clientX <= x + 140) {
    img.src = './assets/images/intro/img7.png';
  } else if (x + 140 > clientX && clientX <= x + 160) {
    img.src = './assets/images/intro/img8.png';
    dragFinished = true;
  } else if (x + 160 > clientX && clientX <= x + 180) {
    img.src = './assets/images/intro/img9.png';
  } else if (x + 180 > clientX && clientX <= x + 200) {
    img.src = './assets/images/intro/img10.png';
  } else if (x + 200 > clientX && clientX <= x + 220) {
    img.src = './assets/images/intro/img11.png';
  } else if (x + 220 > clientX && clientX <= x + 240) {
    img.src = './assets/images/intro/img12.png';
  } else if (x + 240 > clientX && clientX <= x + 260) {
    img.src = './assets/images/intro/img13.png';
  } else if (x + 260 > clientX && clientX <= x + 280) {
    img.src = './assets/images/intro/img14.png';
  } else if (x + 280 > clientX && clientX <= x + 300) {
    img.src = './assets/images/intro/img15.png';
  } else if (x + 300 > clientX && clientX <= x + 320) {
    img.src = './assets/images/intro/img16.png';
  } else if (x + 320 > clientX && clientX <= x + 340) {
    img.src = './assets/images/intro/img17.png';
  }
}

// drag가 끝나고 나서 이벤트
function dragleave() {
  if (dragFinished) {
    const img = document.getElementById('img-drag');
    img.src = './assets/images/intro/img17.png';
    nextScene();
  }
}

function touchEnd() {
  dragleave();
}

// $(document).ready(function () {
//   var selectTarget = $('.select-underline select');
//   selectTarget.change(function () {
//     var select_name = $(this).children('option:selected').text();
//     $(this).siblings('label').text(select_name);
//   });
// });
