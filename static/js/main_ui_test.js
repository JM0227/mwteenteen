/* =======================================================================================================================
 * AUTHOR : 이정민
 * LAST UPDATE : 2025.06.20
 * MAIN UI JS
 * ======================================================================================================================= */
$(function () {
    mainUi.init();
  });

var mainUi = {
	'init':function(){
        mainUi.sectionVisual();
        mainUi.sectionIntro();
        mainUi.sectionEvent();
        mainUi.sectionCard();
        mainUi.sectionTrans();
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
                    el.classList.add('in-view');
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
        mainUi.scrollAnimation.observe('.section.intro', 150, function () {
            const $btn = document.querySelector('.btn-group.bottom');
            if ($btn) {
            setTimeout(() => {
                $btn.classList.add('in-view'); // fade-up!
            }, 400); // intro 등장 후 0.4초 뒤 등장
            }
        });
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
                path: '../../images/json/trans.json' // JSON 경로
            });
        });
    },
}
