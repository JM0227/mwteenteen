/* =======================================================================================================================
 * AUTHOR : 이정민
 * LAST UPDATE : 2025.07.24
 * MAIN UI JS
 * GSAP, Swiper, Lottie 기반 섹션별 인터랙션
 * ======================================================================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // GSAP ScrollTrigger 호출
    gsap.registerPlugin(ScrollTrigger);

    /* ----------------------
	* [Section] Visual
    * - 메인 비주얼 페이드 인
	* ----------------------
	*/
    gsap.from(".section.visual .fade-item", {
        opacity: 0,
        y: 80,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
        delay: 0.2,
    });

    /* ----------------------
	* [Section] Intro
    * - 타이틀 & 말풍선 & CTA 순차 등장
	* ----------------------
	*/
    //타이틀
    gsap.from(".section.intro .title-wrap", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.intro",
            start: "top 80%",
            once: true,
        },
    });

    // 말풍선 + CTA 버튼 애니메이션 타임라인
    const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".section.intro",
          start: "top 60%",
          once: true
        }
    });
      
    // 말풍선 순차 등장
    tl.from(".section.intro .fade-item", {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        delay: 0.2
    }, 0)
      
    // CTA 버튼 등장 (마지막 말풍선과 겹치게)
    .fromTo(".btn-group.bottom", {
        opacity: 0,
        y: 40
    }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.4");

    /* ----------------------
	* [Section] Event
    * - 타이틀 / 리스트 등장
    * - Swiper: 슬라이드 수에 따라 autoplay / indicator 조건 분기
	* ----------------------
	*/
    //타이틀
    gsap.from(".section.event .title-wrap", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.event",
            start: "top 80%",
            once: true,
        },
    });

    //리스트 + swiper 연동
    gsap.from(".section.event .fade-item", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.event",
            start: "top 50%",
            once: true,
            onEnter: () => {
                initEventSwiper();
            }
        },
    });

    // 이벤트 스와이퍼 초기화 함수
    function initEventSwiper() {
        const swiperEl = document.querySelector(".event-swiper");
        const slides = swiperEl.querySelectorAll(".swiper-slide");
        const indicator = swiperEl.querySelector(".cs-indicator");
        const autoplayBtn = swiperEl.querySelector(".btn-autoplay");
        const isSingleSlide = slides.length === 1;
      
        const eventSwiper = new Swiper(".event-swiper", {
          loop: !isSingleSlide,
          autoplay: isSingleSlide ? false : {
            delay: 4000,
            disableOnInteraction: false
          },
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
              slidesPerView: 1,
              spaceBetween: 0
            }
          }
        });
      
        // slide index == 1일때 indicator 숨김
        if (isSingleSlide) {
          indicator?.style.setProperty("display", "none");
        }
      
        // 자동재생 토글 버튼
        autoplayBtn?.addEventListener("click", function () {
          const $this = $(this);
          const $text = $this.find('.hide');
      
          if ($this.hasClass('pause')) {
            eventSwiper.autoplay.stop();
            $this.removeClass('pause');
            $text.text('자동재생');
          } else {
            eventSwiper.autoplay.start();
            $this.addClass('pause');
            $text.text('멈춤');
          }
        });
    }


    /* ----------------------
	* [Section] Card
    * - 타이틀 + 카드 리스트 등장
    * - 카드 Swiper 자동 초기화
	* ----------------------
	*/
    //타이틀
    gsap.from(".section.card .title-wrap", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.card",
            start: "top 80%",
            once: true,
        },
    });

    // 카드 리스트 등장 + Swiper 실행
    gsap.from(".section.card .fade-item", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
          trigger: ".section.card",
          start: "top 50%",
          once: true,
          onEnter: () => {
            const swiper = new Swiper(".main-card-swiper", {
                loop: true,
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: "auto",
                speed: 700,
                autoplay: {
                  delay: 2500,
                  disableOnInteraction: false,
                },
              });
          },
        },
    });

    /* ----------------------
	* [Section] Trans
    * - 타이틀 & 설명 fade-in
    * - Lottie 애니메이션 로딩
	* ----------------------
	*/
    //타이틀
    gsap.from(".section.trans .title-wrap", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.trans",
            start: "top 80%",
            once: true,
        },
    });

    // 내용 등장 + Lottie 애니메이션 실행
    gsap.from(".section.trans .fade-item", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
          trigger: ".section.trans .fade-item",
          start: "top 60%",
          once: true,
          onEnter: () => {
            lottie.loadAnimation({
                container: document.getElementById('lottie-trans'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'https://jm0227.github.io/mwteenteen/static/images/json/trans.json' // JSON 경로
            });
          },
        },
    });

    /* ----------------------
	* [Section] Use
    * - 박스 3개 순차적으로 따로 등장
    * - 'safe' 항목 Lottie 연동
	* ----------------------
	*/

    //conven
    gsap.from(".section.use .use-item.conven", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.use",
            start: "top 50%",
            once: true,
        },
    });

    //safe
    gsap.from(".section.use .use-item.safe", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.use .use-item.safe",
            start: "top 80%",
            once: true,
        },
    });

    //with
    gsap.from(".section.use .use-item.with", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.use .use-item.with",
            start: "top 80%",
            once: true,
        },
    });

    // Lottie 애니메이션 (safe 내부)
    lottie.loadAnimation({
        container: document.getElementById('lottie-safe'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://jm0227.github.io/mwteenteen/static/images/json/safe.json' // JSON 경로
    });

    /* ----------------------
	* [Section] Video
    * - 타이틀 → 영상 → 버튼 순차 등장
	* ----------------------
	*/
    //타이틀
    gsap.from(".section.video .title-wrap", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.video",
            start: "top 80%",
            once: true,
        },
    });

    //영상
    gsap.from(".section.video .video-wrap", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.video",
            start: "top 60%",
            once: true,
        },
    });

    //버튼그룹
    gsap.from(".section.video .btn-group", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.video",
            start: "top 40%",
            once: true,
        },
    });

    /* ----------------------
	* [Section] Download
    * - 탭 → 타이틀 → 이미지 → 버튼 순 애니메이션
    * - 탭 클릭 시 Swiper 슬라이드 전환
	* ----------------------
	*/
    //탭 등장
    gsap.from(".section.download .tab-list.type1", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.download",
            start: "top 80%",
            once: true,
        },
    });

    //타이틀 등장
    gsap.from(".section.download .title-wrap", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.download",
            start: "top 60%",
            once: true,
        },
    });

    //이미지 등장
    gsap.from(".section.download .img-wrap", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.download",
            start: "top 40%",
            once: true,
        },
    });

    //다운로드 버튼 등장
    gsap.from(".section.download .btn", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.download .btn",
            start: "top 90%",
            once: true,
        },
    });

    // 탭 전용 Swiper 초기화 (슬라이드 높이 자동 조절)
    const swiper = new Swiper('.download-swiper', {
        autoHeight: true,
        on: {
                slideChange: function () {
                    // 슬라이드 변경 시 탭에 active 적용
                    document.querySelectorAll('.tab-list li').forEach((li, i) => {
                        li.classList.toggle('active', i === swiper.activeIndex);
                    });
                }
            }
    });

    // 탭 클릭 → 슬라이드 이동
    document.querySelectorAll('.tab-list li').forEach((li, index) => {
        li.addEventListener('click', () => {
            swiper.slideTo(index);
        });
    });
});
