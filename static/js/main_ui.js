/* =======================================================================================================================
 * AUTHOR : 이정민
 * LAST UPDATE : 2025.07.21
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
      
      tl.from(".section.intro .fade-item", {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        delay: 0.2
      }, 0) // 시작 타이밍 0
      
      // 바로 다음에 버튼 등장
      .fromTo(".btn-group.bottom", {
        opacity: 0,
        y: 40
      }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4");  // ← fade-item의 마지막과 겹치게

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
            start: "top 50%",
            once: true,
            onEnter: () => {
                initEventSwiper();
            }
        },
    });

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
      
        // 슬라이드가 하나뿐이면 indicator 숨김
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
    /*
    function initCustomCarousel() {
        // 캐러셀 요소 및 초기화 여부 확인
        const carousel = document.querySelector(".custom-carousel");
        if (!carousel || carousel.classList.contains("inited")) return;
        carousel.classList.add("inited");
    
        // 내부 요소 및 상태 변수 설정
        const slideWrap = carousel.querySelector(".carousel-slides");
        const currentEl = carousel.querySelector(".pagination .current");
        const totalEl = carousel.querySelector(".pagination .total");
        const indicator = carousel.querySelector(".slide-indicator");
        const autoplayBtn = carousel.querySelector(".btn-autoplay");
    
        let currentIndex = 1;
        let autoPlayInterval = null;
        let isPlaying = false;
        let isTransitioning = false;
        const autoPlayDelay = 4000;
        let startX = 0;
        let endX = 0;
    
        // 슬라이드 복제 (모바일에서 무한 루프 구현용)
        const cloneSlides = () => {
        if (window.innerWidth >= 1024) return;
        const slides = carousel.querySelectorAll(".slide");
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);
        slideWrap.insertBefore(lastClone, slides[0]);
        slideWrap.appendChild(firstClone);
        };
    
        // 복제된 슬라이드 제거
        const removeClones = () => {
        const allSlides = carousel.querySelectorAll(".slide");
        if (allSlides.length <= 3) return;
        allSlides.forEach((slide, i) => {
            if (i === 0 || i === allSlides.length - 1) slide.remove();
        });
        };
    
        // 슬라이드 이동 및 인디케이터 갱신
        const updateSlide = (instant = false) => {
        const isMobile = window.innerWidth < 1024;
        const allSlides = carousel.querySelectorAll(".slide");
    
        if (allSlides.length === 1) {
            // 슬라이드가 하나뿐이면 transform 제거하고 인디케이터 고정
            slideWrap.style.transition = "none";
            slideWrap.style.transform = "none";
            currentEl.textContent = "1";
            totalEl.textContent = "1";
            return;
        }
    
        if (!isMobile) {
            slideWrap.style.transition = "none";
            slideWrap.style.transform = "none";
            return;
        }
    
        slideWrap.style.transition = instant ? "none" : "transform 0.4s ease";
        slideWrap.style.transform = `translateX(-${100 * currentIndex}%)`;
    
        const totalSlides = allSlides.length - 2;
        const realIndex = ((currentIndex - 1 + totalSlides) % totalSlides) + 1;
        currentEl.textContent = realIndex;
        totalEl.textContent = totalSlides;
        };
    
        // 다음 슬라이드로 이동
        const goToNext = () => {
        if (isTransitioning || window.innerWidth >= 1024) return;
        const allSlides = carousel.querySelectorAll(".slide");
        if (currentIndex >= allSlides.length - 1) return;
        currentIndex++;
        updateSlide();
        };
    
        // 이전 슬라이드로 이동
        const goToPrev = () => {
        if (isTransitioning || window.innerWidth >= 1024) return;
        const allSlides = carousel.querySelectorAll(".slide");
        if (currentIndex <= 0) {
            currentIndex = allSlides.length - 2;
            updateSlide(true);
            return;
        }
        currentIndex--;
        updateSlide();
        };
    
        // 자동 재생 시작
        const startAutoplay = () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(goToNext, autoPlayDelay);
        isPlaying = true;
        autoplayBtn?.classList.add("pause");
        };
    
        // 자동 재생 정지
        const stopAutoplay = () => {
        clearInterval(autoPlayInterval);
        isPlaying = false;
        autoplayBtn?.classList.remove("pause");
        };
    
        // 자동 재생 토글
        const toggleAutoplay = () => {
        if (window.innerWidth >= 1024) return;
        isPlaying ? stopAutoplay() : startAutoplay();
        };
    
        autoplayBtn?.addEventListener("click", toggleAutoplay);
    
        // 트랜지션 상태 추적 및 무한 루프 처리
        slideWrap.addEventListener("transitionstart", () => {
        isTransitioning = true;
        });
    
        slideWrap.addEventListener("transitionend", () => {
        isTransitioning = false;
        const allSlides = carousel.querySelectorAll(".slide");
        const totalSlides = allSlides.length - 2;
        if (currentIndex === 0) {
            currentIndex = totalSlides;
            updateSlide(true);
        }
        if (currentIndex === allSlides.length - 1) {
            currentIndex = 1;
            updateSlide(true);
        }
        });
    
        // 터치 이벤트 등록
        slideWrap.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        });
    
        slideWrap.addEventListener("touchmove", (e) => {
        endX = e.touches[0].clientX;
        });
    
        slideWrap.addEventListener("touchend", () => {
        const diff = endX - startX;
        if (Math.abs(diff) > 50) diff < 0 ? goToNext() : goToPrev();
        startX = 0;
        endX = 0;
        if (window.innerWidth < 1024) startAutoplay();
        });
    
        // 반응형 처리 (PC/Mobile, 슬라이드 개수 조건에 따른 로직)
        const handleResponsiveState = () => {
        stopAutoplay();
        removeClones();
        currentIndex = 1;
    
        const slides = carousel.querySelectorAll(".slide");
        const isDesktop = window.innerWidth >= 1024;
        const isSingleSlide = slides.length === 1;
    
        if (isSingleSlide) {
            indicator?.style.setProperty("display", "none");
            updateSlide(true);
            return;
        }
    
        if (isDesktop) {
            indicator?.style.setProperty("display", "none");
            updateSlide(true);
        } else {
            cloneSlides();
            indicator?.style.setProperty("display", "flex");
            updateSlide(true);
            startAutoplay();
        }
        };
    
        // 창 크기 변경 시 반응형 재처리
        let resizeTimeout;
        window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleResponsiveState();
        }, 200);
        });
    
        // 최초 실행
        handleResponsiveState();
    }

    gsap.from(".section.event .custom-carousel", {
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
        },
        onComplete: () => {
            //애니메이션 끝난 뒤 캐러셀 실행
            requestAnimationFrame(() => {
                initCustomCarousel();
            });
        }
    });

    function initCarouselLayoutWithoutTransform() {
        const wrap = document.querySelector(".carousel-slides");
        const slides = wrap?.querySelectorAll(".slide");
        if (!wrap || !slides.length) return;
      
        // layout만 설정
        wrap.style.overflowX = "auto";
        wrap.style.display = "flex";
        wrap.style.scrollBehavior = "smooth";
        wrap.scrollLeft = 0;
      
        slides.forEach((slide, i) => {
          slide.style.flex = "0 0 auto";
          slide.style.width = "200px";
          slide.style.marginRight = i < slides.length - 1 ? "24px" : "0px";
          slide.style.transform = "none"; // transform 중지
        });
      
        // 가운데 맞추기 (첫번째 슬라이드 등)
        centerSlide(0);
      }
      
      function centerSlide(index = 0) {
        const wrap = document.querySelector(".carousel-slides");
        const slides = wrap.querySelectorAll(".slide");
        if (!wrap || !slides.length) return;
      
        const target = slides[index];
        const wrapCenter = wrap.offsetWidth / 2;
        const slideCenter = target.offsetLeft + target.offsetWidth / 2;
        const scrollLeft = slideCenter - wrapCenter;
      
        wrap.scrollTo({
          left: scrollLeft,
          behavior: "smooth"
        });
      } */


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
          start: "top 50%",
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

    lottie.loadAnimation({
        container: document.getElementById('lottie-safe'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://jm0227.github.io/mwteenteen/static/images/json/safe.json' // JSON 경로
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
            start: "top 40%",
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

    // Swiper 초기화
    const swiper = new Swiper('.download-swiper', {
        autoHeight: true,
        on: {
                slideChange: function () {
                    document.querySelectorAll('.tab-list li').forEach((li, i) => {
                        li.classList.toggle('active', i === swiper.activeIndex);
                    });
                }
            }
    });

    // 탭 클릭 이벤트
    document.querySelectorAll('.tab-list li').forEach((li, index) => {
        li.addEventListener('click', () => {
            swiper.slideTo(index);
        });
    });
});
