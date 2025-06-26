/* =======================================================================================================================
 * AUTHOR : 이정민
 * LAST UPDATE : 2025.06.20
 * MAIN UI JS
 * ======================================================================================================================= */
$(function(){
	mainUi.init(); //페이지 기본 이벤트
});

var mainUi = {
	'init':function(){
		mainUi.eventSwiper();
        mainUi.mainCardSwiper();
	},

	/* ----------------------
	* 이벤트 slider
	* ----------------------
	*/
	'eventSwiper':function(){
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
	* 카드 slider
	* ----------------------
	*/
    'mainCardSwiper':function(){
		var swiper = new Swiper(".main-card-swiper", {
			loop: true,
			effect:"coverflow",
			grabCursor:true,
            autoplay:true,
			slidesPerView: 'auto',
			centeredSlides: true,
			preventClicks:true,
			coverflowEffect:{
				rotate:0,
				stretch:40,
				depth:200,
				modifier: 1,
				slideShadows: false,
			},
		});
	},
	
}