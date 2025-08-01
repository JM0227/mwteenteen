/* =======================================================================================================================
 * AUTHOR : 이정민
 * LAST UPDATE : 2025.07.11
 * MAIN UI JS
 * ======================================================================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    //scrollTrigger 초기화
    gsap.registerPlugin(ScrollTrigger);

    /* ----------------------
	* Visual
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
	* Intro
	* ----------------------
	*/
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

    const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".section.intro",
          start: "top 60%",
          once: true
        }
      });
      
      // 1. fade-item들 순차적으로 등장
      tl.from(".section.intro .fade-item", {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        delay: 0.2
      })
      
      // 2. 마지막 fade-item까지 끝난 뒤 → 버튼 보여주기
      .add(() => {
        const btn = document.querySelector(".btn-group.bottom");
        btn.classList.remove("hidden");
      })
      
      // 3. 버튼 애니메이션
      .fromTo(".btn-group.bottom", {
        opacity: 0,
        y: 40
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      });

    /* ----------------------
	* Event
	* ----------------------
	*/
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

    gsap.from(".section.event .fade-item", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.event",
            start: "top 60%",
            once: true,
        },
        onEnter: () => {
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
    });

    /* ----------------------
	* Card
	* ----------------------
	*/
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

    gsap.from(".section.card .fade-item", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
          trigger: ".section.card",
          start: "top 60%",
          once: true,
          onEnter: () => {
      
            const swiper = new Swiper(".main-card-swiper", {
              loop: true,
              effect: "coverflow",
              grabCursor: true,
              autoplay: {
                delay: 2000,
                disableOnInteraction: false,
              },
              speed: 600,
              slidesPerView: "auto",
              centeredSlides: true,
              preventClicks: true,
              spaceBetween: 12,
              coverflowEffect: {
                rotate: 0,
                stretch: 40,
                depth: 250,
                modifier: 1,
                slideShadows: false,
              },
            });
            
          },
        },
    });

    /* ----------------------
	* Trans
	* ----------------------
	*/
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

    gsap.from(".section.trans .fade-item", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
          trigger: ".section.trans .fade-item",
          start: "top 80%",
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
	* Use
	* ----------------------
	*/

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

    /* ----------------------
	* Video
	* ----------------------
	*/

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
	* Download
	* ----------------------
	*/
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

    gsap.from(".section.download .img-wrap", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.6,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".section.download",
            start: "top 50%",
            once: true,
        },
    });

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
});
