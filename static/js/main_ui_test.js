/* =======================================================================================================================
 * AUTHOR : 이정민
 * LAST UPDATE : 2025.06.20
 * MAIN UI JS
 * ======================================================================================================================= */
$(function () {
    mainUi.init();

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  });

var mainUi = {
	'init':function(){
        mainUi.sectionVisual();
        mainUi.sectionIntro();
        mainUi.sectionEvent();
        mainUi.sectionCard();
        mainUi.sectionTrans();
        mainUi.sectionUse();
        mainUi.sectionVideo();
        mainUi.sectionDownload();
	},
    
    /* ----------------------
	* 공통 scroll animation
	* ----------------------
	*/
    scrollAnimation: {
        observe: function (selector, delay = 200, callback) {
          const section = document.querySelector(selector);
          if (!section) return;
      
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const animatedEls = entry.target.querySelectorAll('[data-animation]');
      
                animatedEls.forEach((el, i) => {
                  setTimeout(() => {
                    const animationType = el.dataset.animation; // fade-up, fade-in 등
                    el.classList.add('in-view'); // 공통 클래스
                    if (animationType) {
                      el.classList.add(`in-view-${animationType}`);
                    }
      
                    // 마지막 요소 콜백 실행
                    if (i === animatedEls.length - 1 && typeof callback === 'function') {
                      callback();
                    }
                  }, i * delay);
                });
      
                observer.unobserve(entry.target);
              }
            });
          }, {
            threshold: 0.3
          });
      
          observer.observe(section);
        }
    },
    /* ----------------------
	* Main Visual
	* ----------------------
	*/
    'sectionVisual': function () {
        mainUi.scrollAnimation.observe('.section.visual', 150, function () {
            
        });
    },
    /* ----------------------
	* Intro
	* ----------------------
	*/
    'sectionIntro': function () {
        const $btn = document.querySelector('.btn-group.bottom');
        const $intro = document.querySelector('.section.intro');

        if (!$btn || !$intro) return;

        let isRevealed = false;

        // 1. scroll animation 끝난 후 버튼 등장
        mainUi.scrollAnimation.observe('.section.intro', 150, () => {
            setTimeout(() => {
                $btn.classList.remove('hidden');
                isRevealed = true;

                // scroll 감지 시작
                window.addEventListener('scroll', toggleBtnByScroll);
                toggleBtnByScroll(); // 첫 진입 시 상태 체크
            }, 400);
        });

        // 2. scrollTop === 0 이면 버튼 숨기기
        function toggleBtnByScroll() {
            if (!isRevealed) return;

            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (scrollTop === 0) {
                $btn.classList.add('hidden');
            } else {
                $btn.classList.remove('hidden');
            }
        }
    },
    /* ----------------------
	* event
	* ----------------------
	*/
    'sectionEvent': function () {
        mainUi.scrollAnimation.observe('.section.event', 150, function () {

        });

        var swiper = new Swiper(".event-swiper", {
            loop: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            pagination: {
                el: ".swiper-pagination",
                type: "fraction",
            },
            breakpoints: {
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 24 
                },
                0: {
                    slidesPerView: 1, // 모바일 기본값
                    spaceBetween: 0
                }
            },
        });

        // 자동재생 버튼 토글
        $('.btn-autoplay').on('click', function () {
            var $this = $(this);
            var $text = $this.find('.hide');

            if ($this.hasClass('pause')) {
                // 자동재생 멈춤
                swiper.autoplay.stop();
                $this.removeClass('pause');
                $text.text('자동재생');
            } else {
                // 자동재생 시작
                swiper.autoplay.start();
                $this.addClass('pause');
                $text.text('멈춤');
            }
        });
    },
    /* ----------------------
	* card design
	* ----------------------
	*/
    'sectionCard': function () {
        mainUi.scrollAnimation.observe('.section.card', 150, function () {
            // 애니메이션 다 끝난 후에 Swiper 실행
            var swiper = new Swiper(".main-card-swiper", {
            loop: true,
            effect: "coverflow",
            grabCursor: true,
            autoplay: {
                delay: 1500,
                disableOnInteraction: false,
            },
            slidesPerView: 'auto',
            centeredSlides: true,
            preventClicks: true,
            coverflowEffect: {
                rotate: 0,
                stretch: 40,
                depth: 200,
                modifier: 1,
                slideShadows: false,
            },
            });
        });
    },
    /* ----------------------
	* trans
	* ----------------------
	*/
    'sectionTrans': function () {
        mainUi.scrollAnimation.observe('.section.trans', 150, function () {
            lottie.loadAnimation({
                container: document.getElementById('lottie-trans'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'https://jm0227.github.io/mwteenteen/static/images/json/trans.json' // JSON 경로
            });
        });
    },
    /* ----------------------
	* use
	* ----------------------
	*/
    'sectionUse': function () {
        mainUi.scrollAnimation.observe('.section.use', 150, function () {
            
        });

        lottie.loadAnimation({
            container: document.getElementById('lottie-conven'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://jm0227.github.io/mwteenteen/static/images/json/use_conven.json' // JSON 경로
        });
    },

    /* ----------------------
	* video
	* ----------------------
	*/
    'sectionVideo': function () {
        mainUi.scrollAnimation.observe('.section.video', 150, function () {
            
        });
    },
    /* ----------------------
	* App Download
	* ----------------------
	*/
    'sectionDownload': function () {
        mainUi.scrollAnimation.observe('.section.download', 150, function () {
            var swiper = new Swiper(".download-swiper", {
                allowTouchMove: false,
                simulateTouch: false,
                loop: true,
                autoplay:{
                    delay:3000,
                },
                speed: 1000,
                effect: "fade",
            });
        });
    },
}
