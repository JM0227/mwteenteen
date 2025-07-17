/* =======================================================================================================================
 * AUTHOR : 이정민
 * LAST UPDATE : 2025.07.16
 * COMMON UI JS
 * ======================================================================================================================= */
$(function(){
	initSetting.init(); //페이지 기본 이벤트

	//스크롤 복원 막기
	if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
});

var initSetting = {
	'init':function(){
		initSetting.header();
		initSetting.layout();
		initSetting.textField();
		initSetting.btmsSheet.init();
		initSetting.fullLayer.init();
		initSetting.alertLayer.init();
		initSetting.toast.init();
		initSetting.termsList();
		initSetting.tab();
		initSetting.keypad();
		initSetting.question();
		initSetting.selectLoca();
		initSetting.cardSwiper();
		initSetting.tabSwiper();
		initSetting.serviceInfo();
	},

	/* ----------------------
	* html scroll Lock(팝업 오픈 시 사용)
	* ----------------------
	*/
	lock:{
		sct: 0,
		stat: false,
		using:function(opt) {

			if (opt === true && this.stat === false ){
				this.stat = true;
				$('html').addClass('popLock');
			}
			if (opt === false) {
				this.stat = false;
				$('html').removeClass('popLock');
			}
		}
	},

	/* ----------------------
	* 포커스 트랩(웹 접근성 - 팝업 내부 tab 시 외부로 포커스 아웃 x)
	* ----------------------
	*/
	focusTrap: {
		container: null,
		handler: null,
		using: function(opt, containerEl) {
			if (opt === true && containerEl) {
				this.container = containerEl;
				this.start();
			} else if (opt === false) {
				this.stop();
			}
		},
		start: function() {
			const focusables = this.container.querySelectorAll(
				'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
			);
			if (!focusables.length) return;
	
			const first = focusables[0];
			const last = focusables[focusables.length - 1];
	
			this.handler = function(e) {
				if (e.key === 'Tab') {
					if (e.shiftKey && document.activeElement === first) {
						e.preventDefault();
						last.focus();
					} else if (!e.shiftKey && document.activeElement === last) {
						e.preventDefault();
						first.focus();
					}
				}
			};
	
			$(document).on('keydown', this.handler);
		},
		stop: function() {
			$(document).off('keydown', this.handler);
			this.container = null;
			this.handler = null;
		}
	},

	/* ----------------------
	* header
	* ----------------------
	*/
	'header':function(){
		var $header = $('#header');
		var $allmenuBtn = $('.btn-allmenu');
		var $allmenu = $('.allmenu');
		var isMenuOpen = false;

		// GNB 메뉴 버튼 클릭
		$allmenuBtn.on('click', function() {
			var isOpening = !$(this).hasClass('active'); // 열기 상태

			$(this).toggleClass('active');
			$allmenu.stop(true, true).slideToggle(300, function() {
				if (!isOpening) { // 닫은 경우
					if ($(window).scrollTop() === 0) {
						$header.removeClass('active');
					}
				}
			});

			if (isOpening) {
				if (!$header.hasClass('active')) $header.addClass('active');
				initSetting.focusTrap.using(true, $allmenu[0]); // focus trap 시작
			} else {
				initSetting.focusTrap.using(false); // focus trap 해제
				$allmenuBtn.focus(); // 포커스 복원
			}

			$allmenuBtn.attr('aria-expanded', isOpening ? 'true' : 'false');
			isMenuOpen = isOpening;
		});

		// 스크롤 시 처리
		$(window).on('scroll', function() {
			if (isMenuOpen) {
				if (!$header.hasClass('active')) $header.addClass('active');
				return;
			}

			if ($(this).scrollTop() > 0) {
				if (!$header.hasClass('active')) $header.addClass('active');
			} else {
				if ($header.hasClass('active')) $header.removeClass('active');
			}
		});

		// ESC 키로 메뉴 닫기
		$(document).on('keydown', function(e) {
			if (isMenuOpen && e.key === 'Escape') {
				$allmenuBtn.trigger('click'); // 메뉴 닫기
			}
		});
	},

	/* ----------------------
	* layout (하단 버튼 있을 시 padding bottom 자동 적용)
	* ----------------------
	*/
	'layout':function(){
		var $wrap = $('#wrap');
    	var $container = $('#wrap #container');
    	var $bottomBtn = $wrap.find('.btn-group.bottom');

		// #wrap.main 클래스가 없는 경우만 적용
		if (!$wrap.hasClass('main')) {
			var paddingBottom = 48; // 기본값

			if ($bottomBtn.length) {
				paddingBottom = $bottomBtn.outerHeight() + 48;
			}

			$container.css('padding-bottom', paddingBottom + 'px');
		}
	},

	/* ----------------------
	* 바텀시트(dimm 클릭 시 닫힘 X)
	* ----------------------
	*/
	btmsSheet: {
		lastFocusedEl: null,
	
		init: function() {
			var _this = this;
	
			$(document).on('click', '.btmsheet .btn-close', function() {
				var id = $(this).closest('.btmsheet').attr('id');
				_this.close(id);
			});
			/*
			$(document).on('click', '.btmsheet .dimmed', function() {
				var $btmsheet = $(this).closest('.btmsheet');

				$btmsheet.removeClass('on').fadeOut(300, function() {
					if (_this.lastFocusedEl) _this.lastFocusedEl.focus(); //이전 시점으로 포커스 이동
					initSetting.lock.using(false);
					initSetting.focusTrap.using(false); //포커스트랩 해제
				});
				$('[onclick*="btmsSheet.open"]').attr('aria-expanded', 'false'); //버튼 attr
			});
			*/

			//바텀시트 height값이 viewport를 넘길때
			$(window).on('resize', function () {
				$('.btmsheet.on').each(function () {
					const id = $(this).attr('id');
					_this.adjustBtmsBodyHeight(id);
				});
			});
		},
	
		open: function(id, triggerEl) {
			_this = this;
	
			if ($('#' + id).length <= 0) return;
	
			_this.lastFocusedEl = triggerEl || document.activeElement;
	
			const $popup = $('#' + id);
			// full-layer가 열려 있는 경우
			if ($('.full-layer.on:visible').length > 0) {
				$popup.addClass('on-top');
			}
			$popup.fadeIn(300).addClass('on').attr('tabindex', '0').focus();
			
			//바텀시트 height값이 viewport를 넘길때
			const $cont = $popup.find('.cont');
			if ($cont[0].scrollHeight > window.innerHeight) {
				_this.adjustBtmsBodyHeight(id);
			}
	
			$('[onclick*="btmsSheet.open"]').attr('aria-expanded', 'false'); //버튼 attr
			if (triggerEl) $(triggerEl).attr('aria-expanded', 'true'); //해당 버튼에만 attr true

			initSetting.lock.using(true);
			initSetting.focusTrap.using(true, $popup[0]);
		},

		close: function(id) {
			const _this = this;
			const $btmsheet = $('#' + id);
		
			$btmsheet.removeClass('on-top on'); // 슬라이드 아웃 시작
			$btmsheet.find('.btms-body').css('height', '');// 높이 리셋
		
			// transform 애니메이션 대기 후 fadeOut
			setTimeout(function () {
				$btmsheet.fadeOut(0, function () {
					if(_this.lastFocusedEl){
						if(!!_this.lastFocusedEl.focus){
							_this.lastFocusedEl.focus();
						}
					}
					//if (_this.lastFocusedEl) _this.lastFocusedEl.focus();
					initSetting.lock.using(false);
					initSetting.focusTrap.using(false);
				});
			}, 200); // CSS 트랜지션 시간과 동일하게
		
			$('[onclick*="' + id + '"]').attr('aria-expanded', 'false');
		},

		//높이 조절
		adjustBtmsBodyHeight: function(id) {
			const $sheet = $('#' + id);
			const $header = $sheet.find('.btms-header');
			const $footer = $sheet.find('.btms-footer');
			const $body = $sheet.find('.btms-body');
			const $cont = $sheet.find('.cont');
		
			const headerH = $header.outerHeight(true) || 0;
			const footerH = $footer.outerHeight(true) || 0;
			const vh = window.innerHeight;
		
			// 컨텐츠 전체 높이가 100vh를 넘으면 조절, 아니면 높이 제거
			if ($cont[0].scrollHeight > vh) {
				$body.css('height', (vh - headerH - footerH) + 'px');
			} else {
				$body.css('height', ''); // 원래대로
			}
		}
	},

	/* ----------------------
	* 풀 팝업
	* ----------------------
	*/
	fullLayer: {
		lastFocusedEl: null,

		init: function() {
			var _this = this;

			$(document).on('click', '.full-layer .btn-close', function() {
				var id = $(this).closest('.full-layer').attr('id');
				_this.close(id);
			});

			$(window).on('resize orientationchange', function() {
				$('.full-layer.on:visible').each(function() {
					var id = $(this).attr('id');
					_this.adjustBodyHeight(id);
				});
			});
		},

		openPop: [],
		callbacks: {},

		open: function(id, triggerEl) {
			_this = this;

			if ($('#' + id).length <= 0) return;

			_this.lastFocusedEl = triggerEl || document.activeElement;

			_this.opt = $.extend({
				ocb: null,
				ccb: null,
				//zIndex: 1032,
			});

			_this.callbacks[id] = {
				open: _this.opt.ocb,
				close: _this.opt.ccb,
			};

			const $popup = $('#' + id);

			$popup.css({ zIndex: _this.opt.zIndex }).stop().fadeIn(200, function() {
				if (_this.callbacks[id].open) _this.callbacks[id].open();
				$(this).addClass('on');
				_this.adjustBodyHeight(id); // 팝업 열릴 때 높이 조정
			}).attr('tabindex', '0').focus();

			_this.adjustBodyHeight(id); //header/footer 높이 계산 후 body 높이 조정

			$('[onclick*="fullLayer.open"]').attr('aria-expanded', 'false'); //버튼 attr
			if (triggerEl) $(triggerEl).attr('aria-expanded', 'true'); //해당 버튼에만 attr true

			initSetting.lock.using(true);
			initSetting.focusTrap.using(true, $popup[0]);
		},

		close: function(id) {
			_this = this;

			$('#' + id).removeClass('on').stop().fadeOut(200, function() {
				try {
					if (_this.callbacks[id].close) _this.callbacks[id].close();
				} catch (error) { }

				if (!$('.full-layer:visible').length) {
					initSetting.lock.using(false);
					initSetting.focusTrap.using(false);
				}

				//if (_this.lastFocusedEl) _this.lastFocusedEl.focus();
				if(_this.lastFocusedEl) {
					if(!!_this.lastFocusedEl.focus){
						_this.lastFocusedEl.focus();
					}
				}
			});

			$('[onclick*="fullLayer.open"]').attr('aria-expanded', 'false'); //버튼 attr
		},

		//body height 자동화
		adjustBodyHeight: function(id) {
			const $popup = $('#' + id);
			const $header = $popup.find('.full-header');
			const $footer = $popup.find('.full-footer');
			const $body = $popup.find('.full-body');
		  
			const headerHeight = $header.outerHeight() || 0;
			const footerHeight = $footer.length > 0 ? ($footer.outerHeight() || 0) : 0;
		  
			// 모바일 환경 대응: 실제 보이는 뷰포트 높이 계산
			let viewportHeight = window.innerHeight;
			if (window.visualViewport) {
			  viewportHeight = window.visualViewport.height;
			}
		  
			const bodyHeight = viewportHeight - headerHeight - footerHeight;
		  
			// 적용
			$body[0].style.setProperty('height', `${bodyHeight}px`, 'important');
			$body[0].style.setProperty('overflow-y', 'auto', 'important');
		}
	},

	/* ----------------------
	* alert 팝업(dimm 클릭시 닫힘 x)
	* ----------------------
	*/
	alertLayer: {
		lastFocusedEl: null,
	
		init: function() {
			var _this = this;
	
			$(document).on('click', '.alert-layer .btn-close', function() {
				var id = $(this).closest('.alert-layer').attr('id');
				_this.close(id);
			});
		},
	
		open: function(id, triggerEl) {
			_this = this;
	
			if ($('#' + id).length <= 0) return;
	
			_this.lastFocusedEl = triggerEl || document.activeElement;
	
			const $popup = $('#' + id);
			$popup.fadeIn(300).addClass('on').attr('tabindex', '0').focus();
	
			$('[onclick*="alertLayer.open"]').attr('aria-expanded', 'false'); //버튼 attr
			if (triggerEl) $(triggerEl).attr('aria-expanded', 'true'); //해당 버튼에만 attr true
	
			initSetting.lock.using(true);
			initSetting.focusTrap.using(true, $popup[0]);
		},
	
		close: function(id) {
			_this = this;
	
			$('#' + id).removeClass('on').fadeOut(300, function() {
				//if (_this.lastFocusedEl) _this.lastFocusedEl.focus();
				if(_this.lastFocusedEl) {
					if(!!_this.lastFocusedEl.focus){
						_this.lastFocusedEl.focus();
					}
				}
				initSetting.lock.using(false);
				initSetting.focusTrap.using(false); //포커스 트랩 해제
			});
	
			$('[onclick*="alertLayer.open"]').attr('aria-expanded', 'false'); //버튼 attr
		},
	},

	/* ----------------------
	* toast massage
	* ----------------------
	*/
	toast: {
		init: function() {
			const _this = this;
		},
	
		open: function(id) {
			const _this = this;
			const $popup = $('#' + id);
	
			if ($('#' + id).length <= 0) return;
			$popup.fadeIn(300);
	
			// 5초 후 자동 닫힘
			setTimeout(function() {
				$popup.fadeOut(300);
			}, 5000);
		},
	},

	/* ----------------------
	* textFielid
	* ----------------------
	*/
	textField: function() {
		// input focus 됐을 때
		$(document).on('focus', '.field-box .field .item input', function() {
			$('.field-box .field').removeClass('focus');	
			$(this).parent().parent().addClass('focus');
		});
	
		// input 포커스 아웃될 때
		$(document).on('blur', '.field-box .field .item input', function() {
			var $thisItem = $(this).parent().parent();
			setTimeout(function() {
				if (!$thisItem.find(':focus').length) {
					$thisItem.removeClass('focus');
				}
			}, 100);
		});

		//주민등록번호 마스킹
		function maskInput($el) {
			var val = $el.val();
			if (val.length > 1) {
				var masked = val[0] + "⦁".repeat(val.length - 1);
				$el.val(masked);
			}
		}
		$("input.masking").each(function() {
			maskInput($(this)); // 초기값 마스킹
		}).on('input', function() {
			maskInput($(this)); // 입력 시 마스킹
		});

		// textarea 자동 높이 조절
		function resizeTextarea($el) {
			$el.height('auto');
			$el.height($el[0].scrollHeight);
		}
		$(document).on('input', '.field-box textarea', function () {
			resizeTextarea($(this));
		});
		$('.field-box textarea').each(function () {
			resizeTextarea($(this));
		});
		$('.field-box textarea').change(function () {
			resizeTextarea($(this));
		});

		$('.btn-search').prev('input').addClass('no-bg');
	},

	/* ----------------------
	* 약관 동의
	* ----------------------
	*/
	'termsList':function(){
		$('.accordian.terms .item-title input[type="checkbox"]').on('change', function () {
			const isChecked = this.checked;
			const $item = $(this).closest('.item');
			const $cont = $item.find('.item-cont');

			// 하위 체크박스 제어
			$item.find('input[type="checkbox"]').not(this).prop('checked', isChecked);

			if (isChecked) {
				$cont.stop(true).slideUp(200, function () {
				$item.addClass('close');
				});
			} else {
				$cont.stop(true).slideDown(200, function () {
				$item.removeClass('close');
				});
			}
		});
		$('.accordian.terms .item-title').on('click', function(e) {
			// input이나 label 클릭한 경우 무시
			if ($(e.target).is('input') || $(e.target).is('label')) {
				return;
			}

			const $item = $(this).closest('.item');
			const $cont = $item.find('.item-cont');

			if ($item.hasClass('close')) {
				// 열기
				$cont.css({ display: 'block', height: 0, overflow: 'hidden' })
				.animate({ height: $cont.get(0).scrollHeight }, 200, function () {
					$(this).css({ height: '', overflow: '' }); // 원상복구
				});
				$item.removeClass('close');
			} else {
				// 닫기
				$cont.css({ overflow: 'hidden' })
				.animate({ height: 0 }, 200, function () {
					$(this).css({ display: 'none', height: '', overflow: '' });
				});
				$item.addClass('close');
			}
		});
	},

	/* ----------------------
	* Tab
	* ----------------------
	*/
	'tab': function () {
		$('.tab-box').each(function () {
			$(this).find('.tab-list > li:first').addClass('active');
			$(this).find('> .tab-content:first').addClass('active');
		});

		$(".tab-box .tab-list > li").click(function () {
			var $tabBox = $(this).closest('.tab-box');
			var $tabList = $(this).parent();
			var index = $(this).index();

			$(this).addClass('active').siblings().removeClass('active');
			$tabBox.find('> .tab-content').removeClass('active').eq(index).addClass('active');
		});
	},

	/* ----------------------
	* 숫자 입력 키패드 custom
	* ----------------------
	*/
	'keypad':function(){
		const $numBox = $('.num-box span');

		// 숫자 버튼 클릭
		$('.keypad-number button').not('.btn-allDel, .btn-del').on('click', function () {
			const index = $numBox.filter('.active').length;
			if (index < 4) {
				$numBox.eq(index).addClass('active');
			}
		});

		// 전체 삭제 
		$('.btn-allDel').on('click', function () {
			$numBox.removeClass('active');
		});

		// 삭제
		$('.btn-del').on('click', function () {
			const index = $numBox.filter('.active').length;
			if (index > 0) {
				$numBox.eq(index - 1).removeClass('active');
			}
		});
	},

	/* ----------------------
	* 자주묻는 질문 accordian
	* ----------------------
	*/
	'question':function(){
		$('.question-list .list-item .title').on('click', function () {
			const $parent = $(this).parent();
	
			if ($parent.hasClass('active')) {
				$parent.removeClass('active');
			} else {
				$('.question-list .list-item').removeClass('active');
				$parent.addClass('active');
			}
		});
	},

	/* ----------------------
	* 지역 선택 button
	* ----------------------
	*/
	'selectLoca':function(){
		$('.grid-list .item').on('click', function () {
			$(this).parent().find('.item').removeClass('active');
			$(this).addClass('active');
		});
	},

	/* ----------------------
	* 카드 선택 slider
	* ----------------------
	*/
	'cardSwiper':function(){
		var swiper = new Swiper(".card-swiper", {
			loop: true,
			effect:"coverflow",
			grabCursor:true,
			slidesPerView: 'auto',
			centeredSlides: true,
			preventClicks:true,
			coverflowEffect:{
				rotate:0,
				stretch:0,
				depth:300,
				modifier: 1,
				slideShadows: false,
			},
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
			on: {
				slideChangeTransitionStart: function () {
					$('.img-card').removeClass('on');
				}
			},
		});

		// 클릭 - active slide일 때만 toggle
		$(document).on('click', '.card-swiper .img-card', function () {
			if ($(this).closest('.swiper-slide').hasClass('swiper-slide-active')) {
				$(this).toggleClass('on');
			}
		});
	},
	/* ----------------------
	* 탭 swiper(이벤트, 자주묻는 질문)
	* ----------------------
	*/
	'tabSwiper':function(){
		$(".tab-swiper").each(function (index) {
			const $container = $(this);
			
			// 각 탭 스와이프 컨테이너에 클래스를 추가
			$container.addClass(`tab-swiper_${index}`);

			// 탭 스와이프 초기화
			const swiper = new Swiper(`.tab-swiper_${index}`, {
				slidesPerView: "auto",
				preventClicks: true,
				preventClicksPropagation: false,
				observer: true, // 슬라이드 변경 관찰 활성화
				observeParents: true // 부모 요소의 변경도 관찰
			});

			// 탭 항목이 클릭 -> 실행 함수 연결
			$container.on('click', '.swiper-slide span', function (e) {
				e.preventDefault();
				const $item = $(this).parent();

				// 클릭 된 항목을 활성 상태로 표시, 나머지 항목 비활
				$container.find('.swiper-slide').removeClass('active');
				$item.addClass('active');

				// 클릭 항목 가운데 정렬 함수
				centerTabItem($item);
			});

			// 페이지 로드 후 active 클래스가 있는 항목을 가운데 정렬
			const $activeItem = $container.find('.swiper-slide.active');
			if ($activeItem.length > 0) {
				centerTabItem($activeItem);
			}

			function centerTabItem($target) {
				const $wrapper = $container.find('.swiper-wrapper');
				const targetPos = $target.position();
				const containerWidth = $container.width();
				let newPosition = 0;
				let listWidth = 0;

				// 모든 슬라이드의 너비를 합산하여 리스트 전체 너비 계산
				$wrapper.find('.swiper-slide').each(function () {
					listWidth += $(this).outerWidth();
				});

				// 클릭한 항목을 가운데 정렬하기 위한 위치 계산
				const selectTargetPos = targetPos.left + $target.outerWidth() / 2;
				if (containerWidth < listWidth) {
					if (selectTargetPos <= containerWidth / 2) {
						newPosition = 0; // 왼쪽
					} else if ((listWidth - selectTargetPos) <= containerWidth / 2) {
						newPosition = listWidth - containerWidth; // 오른쪽
					} else {
						newPosition = selectTargetPos - containerWidth / 2;
					}
				}

				// 슬라이드를 새 위치로 이동
				$wrapper.css({
					"transform": `translate3d(${-newPosition}px, 0, 0)`,
					"transition-duration": "500ms"
				});
			}
		});
	},

	/* ----------------------
	* 갤럭시 S21 대응
	* ----------------------
	*/
	'androidS21Fix': function() {
      const $btn = document.querySelector('.btn-group.bottom');
      const $container = document.querySelector('#wrap #container');
      if (!$btn || !$container) return;

      const ua = navigator.userAgent;
      const isS21 = /SM-G99/.test(ua); // Galaxy S21 계열: SM-G991 ~ SM-G998

      if (!isS21) return; //S21 아니면 종료

      // 1. 버튼 살짝 띄우기
      $btn.style.position = 'fixed';
      $btn.style.left = '0';
      $btn.style.right = '0';
      $btn.style.zIndex = '9999';
      $btn.style.bottom = '58px'; //인디케이터 위로 살짝 띄움

      // 2. 콘텐츠 패딩 보정
      const btnHeight = $btn.offsetHeight || 48;
      $container.style.paddingBottom = (btnHeight + 72) + 'px'; //버튼 + 인디케이터용 여백

      // 3. 가짜 여백 div 삽입
      if (!document.querySelector('.ghost-padding')) {
        const ghost = document.createElement('div');
        ghost.className = 'ghost-padding';
        ghost.style.height = '72px';
        ghost.style.pointerEvents = 'none';
        $container.appendChild(ghost);
      }

      //console.log('Galaxy S21 하단 대응');
    },

	'serviceInfo': function () {
		const $tit = $('.section.service .tit');

		$tit.on('click', function () {
			const isActive = $(this).hasClass('active');
			$(this).toggleClass('active');

			if (!isActive) {
			// max-height가 적용되기 직후 프레임에 스크롤
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
				const offset = $(this).offset().top - 52;
				$('html, body').stop().animate({ scrollTop: offset }, 300); // 속도도 살짝 줄여서 더 자연스럽게
				});
			});
			}
		});
	},
}
