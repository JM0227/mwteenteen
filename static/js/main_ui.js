/* =======================================================================================================================
 * AUTHOR : 이정민
 * LAST UPDATE : 2025.07.17
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

    //커스텀 캐러셀
    function initCustomCarousel() {
        // slide 찾고, 이미 초기화되었으면 중단
        const carousel = document.querySelector(".custom-carousel");
        if (!carousel) return;
        if (carousel.classList.contains("inited")) return;
        carousel.classList.add("inited");

        // 내부 요소들 선언
        const slideWrap = carousel.querySelector(".carousel-slides");
        const currentEl = carousel.querySelector(".pagination .current");
        const totalEl = carousel.querySelector(".pagination .total");
        const indicator = carousel.querySelector(".slide-indicator");
        const autoplayBtn = carousel.querySelector(".btn-autoplay");

        // 상태 변수들
        let currentIndex = 1;
        let autoPlayInterval = null;
        let isPlaying = false;
        let isTransitioning = false;
        const autoPlayDelay = 4000;
        let startX = 0;
        let endX = 0;

        //모바일 전용: 슬라이드 처음과 끝 복제, infinite roop
        const cloneSlides = () => {
            if (window.innerWidth >= 1024) return;
            const slides = carousel.querySelectorAll(".slide");
            const firstClone = slides[0].cloneNode(true);
            const lastClone = slides[slides.length - 1].cloneNode(true);
            slideWrap.insertBefore(lastClone, slides[0]);
            slideWrap.appendChild(firstClone);
        };

        //복제 슬라이드 제거 (리사이즈 시 초기화 용도)
        const removeClones = () => {
            const allSlides = carousel.querySelectorAll(".slide");
            if (allSlides.length <= 3) return;
            allSlides.forEach((slide, i) => {
                if (i === 0 || i === allSlides.length - 1) {
                    slide.remove();
                }
            });
        };

        //슬라이드 위치 및 인디케이터 갱신
        const updateSlide = (instant = false) => {
            const isMobile = window.innerWidth < 1024;
            const allSlides = carousel.querySelectorAll(".slide");

            if (allSlides.length === 1) {
                //슬라이드가 하나일 경우 예외 처리
                slideWrap.style.transition = "none";
                slideWrap.style.transform = "none";
                currentEl.textContent = "1";
                totalEl.textContent = "1";
                return;
            }

            if (!isMobile) {
                //PC에선 transform 적용 안 함 (슬라이드 3개 동시에 노출)
                slideWrap.style.transition = "none";
                slideWrap.style.transform = "none";
                return;
            }

            //모바일: 슬라이드 이동
            slideWrap.style.transition = instant ? "none" : "transform 0.4s ease";
            slideWrap.style.transform = `translateX(-${100 * currentIndex}%)`;

            //인디케이터 표시용 실제 인덱스 계산
            const totalSlides = allSlides.length - 2;
            const realIndex = ((currentIndex - 1 + totalSlides) % totalSlides) + 1;
            currentEl.textContent = realIndex;
            totalEl.textContent = totalSlides;
        };
        
        //다음 슬라이드 이동
        const goToNext = () => {
            if (isTransitioning || window.innerWidth >= 1024) return;
            const allSlides = carousel.querySelectorAll(".slide");
            if (currentIndex >= allSlides.length - 1) return;
            currentIndex++;
            updateSlide();
        };

        //이전 슬라이드 이동
        const goToPrev = () => {
            if (isTransitioning || window.innerWidth >= 1024) return;
        
            const allSlides = carousel.querySelectorAll(".slide");
        
            //맨 앞 클론 슬라이드에서 진짜 마지막으로 점프 가능
            if (currentIndex <= 0) {
                currentIndex = allSlides.length - 2; // 마지막 실제 슬라이드 인덱스
                updateSlide(true); // 순간 이동
                return;
            }
        
            currentIndex--;
            updateSlide();
        };
        //자동 재생 시작
        const startAutoplay = () => {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(goToNext, autoPlayDelay);
            isPlaying = true;
            autoplayBtn?.classList.add("pause");
        };

        //자동 재생 정지
        const stopAutoplay = () => {
            clearInterval(autoPlayInterval);
            isPlaying = false;
            autoplayBtn?.classList.remove("pause");
        };

        //자동 재생 토글 버튼
        const toggleAutoplay = () => {
            if (window.innerWidth >= 1024) return;
            isPlaying ? stopAutoplay() : startAutoplay();
        };

        autoplayBtn?.addEventListener("click", toggleAutoplay);

        //트랜지션 중 상태 체크
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
            //무한 루프용 인덱스 재설정
            if (currentIndex === allSlides.length - 1) {
                currentIndex = 1;
                updateSlide(true);
            }
        });

        //터치 이벤트: 시작
        slideWrap.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        });

        //터치 이벤트: 이동
        slideWrap.addEventListener("touchmove", (e) => {
            endX = e.touches[0].clientX;
        });

        //터치 이벤트: 종료 시 슬라이드 이동
        slideWrap.addEventListener("touchend", () => {
            const diff = endX - startX;
            if (Math.abs(diff) > 50) {
                diff < 0 ? goToNext() : goToPrev();
            }
            startX = 0;
            endX = 0;
            if (window.innerWidth < 1024) {
                startAutoplay();
            }
        });
        //반응형 상태 처리 (복제 및 autoplay 조절)
        const handleResponsiveState = () => {
            stopAutoplay(); // autoplay 정지
            removeClones(); // 기존 복제 슬라이드 제거
            currentIndex = 1; // 슬라이드 인덱스 초기화

            const slides = carousel.querySelectorAll(".slide");
            const isDesktop = window.innerWidth >= 1024;
            const isSingleSlide = slides.length === 1;

            if (isSingleSlide) {
                //슬라이드가 하나일 경우 → 캐러셀 기능 숨김
                indicator?.style.setProperty("display", "none");
                updateSlide(true);
                return;
            }

            if (isDesktop) {
                //PC 환경: transform 및 autoplay 제거
                indicator?.style.setProperty("display", "none");
                updateSlide(true);
            } else {
                //모바일 환경: 복제 후 무한 루프 + autoplay
                cloneSlides();
                indicator?.style.setProperty("display", "flex");
                updateSlide(true);
                startAutoplay();
            }
        };

        //resize 이벤트로 반응형 상태 갱신
        let resizeTimeout;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                handleResponsiveState();
            }, 200);
        });

        //초기 상태 설정
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
      }


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
