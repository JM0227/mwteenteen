/* =======================================================================================================================
 * AUTHOR : 이정민
 * LAST UPDATE : 2025.07.24
 * COMMON UI JS
 * 공통 UI 기능(레이어 팝업, 탭, 토스트 등) 초기화 및 제어
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
		initSetting.question();
		initSetting.selectLoca();
		initSetting.cardSwiper();
		initSetting.tabSwiper();
		initSetting.serviceInfo();
	},

	/* ----------------------
	* html scroll Lock
	* - 팝업 오픈 시 스크롤 방지
	* ----------------------
	*/
	lock:{
		sct: 0, //스크롤 위치 저장용 (미사용)
		stat: false, //잠금 여부
		using:function(opt) {

			if (opt === true && this.stat === false ){
				this.stat = true;
				$('html').addClass('popLock'); //스크롤 잠금
			}
			if (opt === false) {
				this.stat = false;
				$('html').removeClass('popLock'); //스크롤 해제
			}
		}
	},

	/* ----------------------
	* 포커스 트랩(팝업 내 탭 이동 제한)
	* - 팝업 내에서 Tab 키로 포커스가 빠져나가지 않도록 제한
 	* - 웹 접근성 대응용
	* ----------------------
	*/
	focusTrap: {
		container: null, //트랩 대상 컨테이너
		handler: null, //이벤트 핸들러 참조용
		using: function(opt, containerEl) {
			if (opt === true && containerEl) { //트랩 시작 조건: 활성화 요청 + 컨테이너 존재
				this.container = containerEl;
				this.start();
			} else if (opt === false) {  //트랩 해제 조건: 비활성화 요청
				this.stop();
			}
		},
		start: function() {
			//포커스 가능한 요소 모두 선택
			const focusables = this.container.querySelectorAll(
				'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
			);
			if (!focusables.length) return; //포커스 요소 없으면 종료
	
			const first = focusables[0]; //첫 번째 요소
			const last = focusables[focusables.length - 1]; //마지막 요소
			
			//Tab 키 이벤트 핸들링
			this.handler = function(e) {
				if (e.key === 'Tab') { //Tab 키 눌렸을 때
					if (e.shiftKey && document.activeElement === first) { //Shift+Tab + 첫 요소 → 마지막으로 이동
						e.preventDefault();
						last.focus(); 
					} else if (!e.shiftKey && document.activeElement === last) { //Tab + 마지막 요소 → 처음으로 이동
						e.preventDefault();
						first.focus();
					}
				}
			};

			$(document).on('keydown', this.handler); //키다운 이벤트 등록
		},
		stop: function() {
			$(document).off('keydown', this.handler); // 이벤트 제거
			this.container = null;
			this.handler = null;
		}
	},

	/* ----------------------
	* header
	* - 전체메뉴 버튼 클릭 시 메뉴 열기/닫기
	* - 스크롤 시 헤더 스타일 제어
	* - ESC 키로 메뉴 닫기
	* ----------------------
	*/
	'header':function(){
		var $header = $('#header');
		var $allmenuBtn = $('.btn-allmenu');
		var $allmenu = $('.allmenu');
		var isMenuOpen = false; //메뉴 열림 상태

		//전체메뉴 버튼 클릭 시
		$allmenuBtn.on('click', function() {
			var isOpening = !$(this).hasClass('active'); //true면 열기, false면 닫기

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

			$allmenuBtn.attr('aria-expanded', isOpening ? 'true' : 'false'); // 접근성 속성
			isMenuOpen = isOpening;
		});

		// 스크롤 시 헤더 상태 제어
		$(window).on('scroll', function() {
			if (isMenuOpen) {
				if (!$header.hasClass('active')) $header.addClass('active');
				return;
			}

			if ($(this).scrollTop() > 0) { // 스크롤된 상태
				if (!$header.hasClass('active')) $header.addClass('active');
			} else { // 최상단
				if ($header.hasClass('active')) $header.removeClass('active');
			}
		});

		// ESC 키로 메뉴 닫기
		$(document).on('keydown', function(e) {
			if (isMenuOpen && e.key === 'Escape') {
				$allmenuBtn.trigger('click'); // 닫기 트리거
			}
		});
	},

	/* ----------------------
	* layout
	* - 하단 버튼 있을 경우 container에 padding-bottom 자동 적용
	* ----------------------
	*/
	'layout':function(){
		var $wrap = $('#wrap');
    	var $container = $('#wrap #container');
    	var $bottomBtn = $wrap.find('.btn-group.bottom');

		// 메인 페이지가 아닐 때만 적용
		if (!$wrap.hasClass('main')) {
			var paddingBottom = 48; // 기본 여백

			if ($bottomBtn.length) { //하단 버튼이 있을 경우
				paddingBottom = $bottomBtn.outerHeight() + 48;
			}

			$container.css('padding-bottom', paddingBottom + 'px');
		}
	},

	/* ----------------------
	* 바텀시트
	* - 열기/닫기 및 높이 조절
 	* - 포커스 관리 및 접근성 대응 포함
	* ----------------------
	*/
	btmsSheet: {
		lastFocusedEl: null, // 닫을 때 복원할 포커스 대상
	
		init: function() {
			var _this = this;
			
			// 닫기 버튼 클릭
			$(document).on('click', '.btmsheet .btn-close', function() {
				var id = $(this).closest('.btmsheet').attr('id');
				_this.close(id);
			});
			/* dimmed 영역 클릭 시 닫기 (필요 시 주석 해제)
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

			// 뷰포트 변화 시 높이 재계산
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

			// 다른 full-layer가 열려있으면 on-top 적용
			if ($('.full-layer.on:visible').length > 0) {
				$popup.addClass('on-top');
			}
			$popup.fadeIn(300).addClass('on').attr('tabindex', '0').focus();
			
			// 컨텐츠 높이가 뷰포트를 초과할 경우 height 조절
			const $cont = $popup.find('.cont');
			if ($cont[0].scrollHeight > window.innerHeight) {
				_this.adjustBtmsBodyHeight(id);
			}
			
			// 접근성 속성 처리
			$('[onclick*="btmsSheet.open"]').attr('aria-expanded', 'false'); // 전체 false
			if (triggerEl) $(triggerEl).attr('aria-expanded', 'true'); // 해당 버튼만 true

			initSetting.lock.using(true); // 스크롤 잠금
			initSetting.focusTrap.using(true, $popup[0]); // 포커스 트랩 시작
		},

		close: function(id) {
			const _this = this;
			const $btmsheet = $('#' + id);
		
			$btmsheet.removeClass('on-top on'); // on-top 클래스 제거
			$btmsheet.find('.btms-body').css('height', ''); // 높이 초기화
		
			// 애니메이션 후 닫힘 처리
			setTimeout(function () {
				$btmsheet.fadeOut(0, function () {
					if(_this.lastFocusedEl){
						if(!!_this.lastFocusedEl.focus){
							_this.lastFocusedEl.focus(); // 포커스 복원
						}
					}
					initSetting.lock.using(false); // 스크롤 해제
					initSetting.focusTrap.using(false); // 포커스 트랩 해제
				});
			}, 200); // 트랜지션 시간과 맞춤
			
			// 접근성 속성 초기화
			$('[onclick*="' + id + '"]').attr('aria-expanded', 'false');
		},

		// 컨텐츠가 100vh 넘을 경우 높이 조절
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
	* - 열기/닫기 + body 높이 조정 + 접근성 대응 + 콜백 처리
	* ----------------------
	*/
	fullLayer: {
		lastFocusedEl: null, // 닫을 때 복원할 포커스 대상

		init: function() {
			var _this = this;

			// 닫기 버튼 클릭
			$(document).on('click', '.full-layer .btn-close', function() {
				var id = $(this).closest('.full-layer').attr('id');
				_this.close(id);
			});

			// 화면 회전 or 리사이즈 시 body 높이 재계산
			$(window).on('resize orientationchange', function() {
				$('.full-layer.on:visible').each(function() {
					var id = $(this).attr('id');
					_this.adjustBodyHeight(id);
				});
			});
		},

		openPop: [], // 열려 있는 팝업들
		callbacks: {}, // 콜백 저장소

		open: function(id, triggerEl) {
			_this = this;

			if ($('#' + id).length <= 0) return;

			_this.lastFocusedEl = triggerEl || document.activeElement;

			// 콜백 옵션 초기화 (zIndex는 안 쓰이지만 구조 상 남아있음)
			_this.opt = $.extend({
				ocb: null, // open callback
				ccb: null, // close callback
			});

			_this.callbacks[id] = {
				open: _this.opt.ocb,
				close: _this.opt.ccb,
			};

			const $popup = $('#' + id);

			$popup.css({ zIndex: _this.opt.zIndex }).stop().fadeIn(200, function() {
				if (_this.callbacks[id].open) _this.callbacks[id].open(); // open 콜백 실행
				$(this).addClass('on');
				_this.adjustBodyHeight(id); // 열리면서 높이 조정
			}).attr('tabindex', '0').focus();

			_this.adjustBodyHeight(id); // 초기 높이 조정

			// 접근성 속성 처리
			$('[onclick*="fullLayer.open"]').attr('aria-expanded', 'false');
			if (triggerEl) $(triggerEl).attr('aria-expanded', 'true');

			initSetting.lock.using(true); // 스크롤 잠금
			initSetting.focusTrap.using(true, $popup[0]); // 포커스 트랩 시작
		},

		close: function(id) {
			_this = this;

			$('#' + id).removeClass('on').stop().fadeOut(200, function() {
				try {
					if (_this.callbacks[id].close) _this.callbacks[id].close(); // close 콜백 실행
				} catch (error) { }

				// 모든 풀 레이어 팝업이 닫혔을 때만 lock 해제
				if (!$('.full-layer:visible').length) {
					initSetting.lock.using(false);
					initSetting.focusTrap.using(false);
				}

				// 포커스 복원
				if(_this.lastFocusedEl) {
					if(!!_this.lastFocusedEl.focus){
						_this.lastFocusedEl.focus();
					}
				}
			});

			// 접근성 속성 초기화
			$('[onclick*="fullLayer.open"]').attr('aria-expanded', 'false'); //버튼 attr
		},

		// body 높이 자동 조정
		adjustBodyHeight: function(id) {
			const $popup = $('#' + id);
			const $header = $popup.find('.full-header');
			const $footer = $popup.find('.full-footer');
			const $body = $popup.find('.full-body');
		  
			const headerHeight = $header.outerHeight() || 0;
			const footerHeight = $footer.length > 0 ? ($footer.outerHeight() || 0) : 0;
		  
			// 모바일 환경 대응: visualViewport가 있으면 우선 사용
			let viewportHeight = window.innerHeight;
			if (window.visualViewport) {
			  viewportHeight = window.visualViewport.height;
			}
		  
			const bodyHeight = viewportHeight - headerHeight - footerHeight;
		  
			// 강제로 높이 지정 + 스크롤 가능 처리
			$body[0].style.setProperty('height', `${bodyHeight}px`, 'important');
			$body[0].style.setProperty('overflow-y', 'auto', 'important');
		}
	},

	/* ----------------------
	* alert 팝업
	* - 포커스 복원 및 접근성 대응 포함
	* ----------------------
	*/
	alertLayer: {
		lastFocusedEl: null, // 포커스 복원용
	
		init: function() {
			var _this = this;
			
			// 닫기 버튼 클릭 시
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
			
			// 접근성 속성 처리
			$('[onclick*="alertLayer.open"]').attr('aria-expanded', 'false');
			if (triggerEl) $(triggerEl).attr('aria-expanded', 'true');
	
			initSetting.lock.using(true); // 스크롤 잠금
			initSetting.focusTrap.using(true, $popup[0]); // 포커스 트랩
		},
	
		close: function(id) {
			_this = this;
	
			$('#' + id).removeClass('on').fadeOut(300, function() {
				// 포커스 복원
				if(_this.lastFocusedEl) {
					if(!!_this.lastFocusedEl.focus){
						_this.lastFocusedEl.focus();
					}
				}
				initSetting.lock.using(false);  // 스크롤 해제
				initSetting.focusTrap.using(false); //포커스 트랩 해제
			});
			
			// 접근성 속성 초기화
			$('[onclick*="alertLayer.open"]').attr('aria-expanded', 'false');
		},
	},

	/* ----------------------
	* toast massage
	* - 일시적으로 메시지 노출 후 자동 닫힘
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
			$popup.fadeIn(300); // 토스트 노출
	
			// 5초 후 자동 닫힘
			setTimeout(function() {
				$popup.fadeOut(300);
			}, 5000);
		},
	},

	/* ----------------------
	* textFielid
	 * - input focus 스타일 제어
	 * - 주민등록번호 마스킹
	 * - textarea 자동 높이 조절
	* ----------------------
	*/
	textField: function() {
		// input focus 시 field-box에 .focus 클래스 추가
		$(document).on('focus', '.field-box .field .item input', function() {
			$('.field-box .field').removeClass('focus');	
			$(this).parent().parent().addClass('focus');
		});
	
		// input blur 시 포커스 해제
		$(document).on('blur', '.field-box .field .item input', function() {
			var $thisItem = $(this).parent().parent();
			setTimeout(function() {
				if (!$thisItem.find(':focus').length) {
					$thisItem.removeClass('focus');
				}
			}, 100);
		});

		// 주민등록번호 마스킹 처리
		function maskInput($el) {
			var val = $el.val();
			if (val.length > 1) {
				var masked = val[0] + "⦁".repeat(val.length - 1);
				$el.val(masked);
			}
		}
		$("input.masking").each(function() {
			maskInput($(this)); // 초기 마스킹
		}).on('input', function() {
			maskInput($(this)); // 입력 시 마스킹
		});

		// textarea 자동 높이 조절
		function resizeTextarea($el) {
			$el.height('auto');
			$el.height($el[0].scrollHeight);
		}

		 // 입력 시 / 초기 / 변경 시 모두 적용
		$(document).on('input', '.field-box textarea', function () {
			resizeTextarea($(this));
		});
		$('.field-box textarea').each(function () {
			resizeTextarea($(this));
		});
		$('.field-box textarea').change(function () {
			resizeTextarea($(this));
		});

		// 검색 input에 no-bg 클래스 부여
		$('.btn-search').prev('input').addClass('no-bg');
	},

	/* ----------------------
	* 약관 동의
	* - 전체 동의 시 하위 체크박스 일괄 제어
 	* - 항목별 아코디언 열기/닫기
	* ----------------------
	*/
	'termsList':function(){
		// 약관 항목 내 체크박스 상태 변경 시
		$('.accordian.terms .item-title input[type="checkbox"]').on('change', function () {
			const isChecked = this.checked;
			const $item = $(this).closest('.item');
			const $cont = $item.find('.item-cont');

			// 하위 체크박스 전체 상태 일치시킴 (자기 자신 제외)
			$item.find('input[type="checkbox"]').not(this).prop('checked', isChecked);

			if (isChecked) { // 전체 동의 → 내용 접기
				$cont.stop(true).slideUp(200, function () {
					$item.addClass('close');
				});
			} else { // 체크 해제 → 내용 열기
				$cont.stop(true).slideDown(200, function () {
					$item.removeClass('close');
				});
			}
		});

		// 타이틀 영역 클릭 시 아코디언 열고 닫기
		$('.accordian.terms .item-title').on('click', function(e) {
			// input 또는 label 클릭은 제외 (체크박스 제어 방지)
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
	* - 탭 클릭 시 해당 컨텐츠로 전환
	* ----------------------
	*/
	'tab': function () {

		//초기 상태: 각 탭 박스 내 첫 번째 탭 & 컨텐츠 활성화
		$('.tab-box').each(function () {
			$(this).find('.tab-list > li:first').addClass('active');
			$(this).find('> .tab-content:first').addClass('active');
		});

		// 탭 클릭 시 동작
		$(".tab-box .tab-list > li").click(function () {
			var $tabBox = $(this).closest('.tab-box');
			var $tabList = $(this).parent();
			var index = $(this).index();

			// 탭 활성화
			$(this).addClass('active').siblings().removeClass('active');

			// 같은 index의 탭 컨텐츠 활성화
			$tabBox.find('> .tab-content').removeClass('active').eq(index).addClass('active');
		});
	},

	/* ----------------------
	* 자주묻는 질문 accordian
	* - 질문 클릭 시 하나만 열리는 단일 오픈 방식
	* ----------------------
	*/
	'question':function(){
		$('.question-list .list-item .title').on('click', function () {
			const $parent = $(this).parent();
	
			if ($parent.hasClass('active')) {
				// 이미 열린 항목 클릭 → 닫기
				$parent.removeClass('active');
			} else {
				// 다른 항목 닫고 현재 항목 열기
				$('.question-list .list-item').removeClass('active');
				$parent.addClass('active');
			}
		});
	},

	/* ----------------------
	* 지역 선택 button
	* - 하나만 선택되도록 active 클래스 제어
	* ----------------------
	*/
	'selectLoca':function(){
		$('.grid-list .item').on('click', function () {
			// 같은 그룹의 항목 전체 비활성화 후 현재 항목만 활성화
			$(this).parent().find('.item').removeClass('active');
			$(this).addClass('active');
		});
	},

	/* ----------------------
	* 카드 선택 swiper
	* - coverflow 효과 + active 카드 클릭 시 앞뒷면 토글
	* ----------------------
	*/
	'cardSwiper':function(){
		var swiper = new Swiper(".card-swiper", {
			loop: true, // 무한 루프
			effect:"coverflow", // 3D 카드 넘김 효과
			grabCursor:true, // 커서 grab 모양
			slidesPerView: 'auto',
			centeredSlides: true, //가운데 정렬
			preventClicks:true,
			coverflowEffect:{
				rotate:0,
				stretch:0,
				depth:300, // 입체감 깊이
				modifier: 1,
				slideShadows: false,
			},
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
			// 슬라이드 변경 시작 시 카드 상태 초기화
			on: {
				slideChangeTransitionStart: function () {
					$('.img-card').removeClass('on');
				}
			},
		});

		// 카드 클릭 시 (active 슬라이드일 경우에만 toggle)
		$(document).on('click', '.card-swiper .img-card', function () {
			if ($(this).closest('.swiper-slide').hasClass('swiper-slide-active')) {
				$(this).toggleClass('on');
			}
		});
	},
	/* ----------------------
	* 탭 swiper(이벤트, 자주묻는 질문)
	* - 가로 스와이프 가능한 탭
 	* - 탭 클릭 시 가운데 정렬
	* ----------------------
	*/
	'tabSwiper':function(){
		$(".tab-swiper").each(function (index) {
			const $container = $(this);
			
			// 각 swiper마다 고유 클래스 부여
			$container.addClass(`tab-swiper_${index}`);

			// swiper 초기화
			const swiper = new Swiper(`.tab-swiper_${index}`, {
				slidesPerView: "auto",
				preventClicks: true,
				preventClicksPropagation: false,
				observer: true, // 슬라이드 내부 변화 감지
				observeParents: true // 부모 요소 변화 감지
			});

			// 탭 클릭 시 동작
			$container.on('click', '.swiper-slide span', function (e) {
				e.preventDefault();
				const $item = $(this).parent();

				// 탭 active 상태 설정
				$container.find('.swiper-slide').removeClass('active');
				$item.addClass('active');

				// 가운데 정렬
				centerTabItem($item);
			});

			// 초기 active 탭이 있을 경우 → 가운데 정렬
			const $activeItem = $container.find('.swiper-slide.active');
			if ($activeItem.length > 0) {
				centerTabItem($activeItem);
			}

			// 탭 가운데 정렬 함수
			function centerTabItem($target) {
				const $wrapper = $container.find('.swiper-wrapper');
				const targetPos = $target.position();
				const containerWidth = $container.width();
				let newPosition = 0;
				let listWidth = 0;

				// 전체 슬라이드 너비 계산
				$wrapper.find('.swiper-slide').each(function () {
					listWidth += $(this).outerWidth();
				});

				// 중앙 정렬 위치 계산
				const selectTargetPos = targetPos.left + $target.outerWidth() / 2;
				if (containerWidth < listWidth) {
					if (selectTargetPos <= containerWidth / 2) {
						newPosition = 0; // 왼쪽 정렬
					} else if ((listWidth - selectTargetPos) <= containerWidth / 2) {
						newPosition = listWidth - containerWidth; // 오른쪽 정렬
					} else {
						newPosition = selectTargetPos - containerWidth / 2; // 가운데 정렬
					}
				}

				// wrapper 이동 처리
				$wrapper.css({
					"transform": `translate3d(${-newPosition}px, 0, 0)`,
					"transition-duration": "500ms"
				});
			}
		});
	},

	/* ----------------------
	* 갤럭시 S21 대응
	* - 하단 인디케이터와 버튼 겹침 방지용 처리
	* ----------------------
	*/
	'androidS21Fix': function() {
      const $btn = document.querySelector('.btn-group.bottom');
      const $container = document.querySelector('#wrap #container');
      if (!$btn || !$container) return;

      const ua = navigator.userAgent;
      const isS21 = /SM-G99/.test(ua); // Galaxy S21 계열: SM-G991 ~ SM-G998

      if (!isS21) return; //S21 아니면 종료

      // 1. 버튼을 하단에서 띄워 고정 (인디케이터 가림 방지)
      $btn.style.position = 'fixed';
      $btn.style.left = '0';
      $btn.style.right = '0';
      $btn.style.zIndex = '9999';
      $btn.style.bottom = '58px'; // 하단 인디케이터 고려

      // 2. 콘텐츠 영역 하단 여백 확보 (버튼 + 인디케이터 높이)
      const btnHeight = $btn.offsetHeight || 48;
      $container.style.paddingBottom = (btnHeight + 72) + 'px'; //버튼 + 인디케이터용 여백

       // 3. 가짜 여백 요소 삽입 (스크롤 시 자연스러운 공간 확보)
      if (!document.querySelector('.ghost-padding')) {
        const ghost = document.createElement('div');
        ghost.className = 'ghost-padding';
        ghost.style.height = '72px';
        ghost.style.pointerEvents = 'none';
        $container.appendChild(ghost);
      }
    },

	/* ----------------------
	* 서비스 정보
	* - 제목 클릭 시 active 상태 toggle
	* - 열릴 때 해당 위치로 스크롤
	* ---------------------- */
	'serviceInfo': function () {
		const $tit = $('.section.service .tit');

		$tit.on('click', function () {
			const isActive = $(this).hasClass('active');
			$(this).toggleClass('active');

			if (!isActive) {
				// 막 열렸을 때 → 스크롤 위치 보정
				// (max-height 등 CSS 반영된 다음 프레임에서 처리)
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						const offset = $(this).offset().top - 52;
						$('html, body').stop().animate({ scrollTop: offset }, 300);
					});
				});
			}
		});
	},
}
