$(document).ready(() => {
  new Popup();
  new Tooltip();

  let lastScrollTop = 0;
  
  $(window).scroll(function() {
    let currentScrollTop = $(this).scrollTop();

    $('.header').css('height', currentScrollTop > lastScrollTop ? '0px' : '64px');
      
    lastScrollTop = currentScrollTop;
  });

  $('.scroll').click(function () {
    const scrollTargetTop = $($(this).attr('href')).offset().top;
    
    $('html').animate({
      scrollTop: scrollTargetTop
    }, Math.abs(window.pageYOffset - scrollTargetTop) / 4);
  });

  $('.scroll-region').click(function () {
    const scrollTargetTop = $($(this).attr('href')).offset().top;

    $('.regions').animate({
      height: '0px'
    }, Math.abs(window.pageYOffset - scrollTargetTop) / 4);
  });
});

class Popup {
  constructor() {
      this.initPopupHandlers();
  }

  initPopupHandlers() {
      $(document).on('click', '.map__point', (e) => {
          const popupId = $(e.currentTarget).data('popup-id');
          this.openPopup(popupId);
      });

      $(document).on('click', '.popup__close', (e) => {
          this.closePopup($(e.target).closest('.overlay'));
      });

      $(document).on('click', '.overlay', (e) => {
          if (e.target === e.currentTarget) {
              this.closePopup($(e.currentTarget));
          }
      });

      $(document).on('keydown', (e) => {
          if (e.key === 'Escape') {
              this.closeAllPopups();
          }
      });

      // Обработчик для кнопок "Далее" внутри попапов
      $(document).on('click', '.popup__button', (e) => {
          this.handleNextButton($(e.target));
      });
  }

  openPopup(popupId) {
      const $popup = $(`#popup-${popupId}`);
      this.resetPopup($popup);
      $popup.fadeIn(200);
      $('body').css('overflow', 'hidden');
  }

  closePopup($popup) {
      $popup.fadeOut(200);
      $('body').css('overflow', '');
  }

  closeAllPopups() {
      $('.overlay').fadeOut(200);
      $('body').css('overflow', '');
  }

  resetPopup($popup) {
      return;

      const $steps = $popup.find('.popup__step');
      $steps.hide(); // Скрываем все шаги
      $popup.find('.popup__step[data-step="1"]').show(); // Показываем только первый шаг
  }

  // Обработка нажатия кнопки "Далее"
  handleNextButton($button) {
      const $currentStep = $button.closest('.popup__step');
      const nextStepNumber = $button.data('next');
      const $popupContent = $button.closest('.popup__content');
      
      // Скрываем текущий шаг
      $currentStep.hide();
      
      // Показываем следующий шаг
      const $nextStep = $popupContent.find(`.popup__step[data-step="${nextStepNumber}"]`);
      if ($nextStep.length) {
          $nextStep.show();
      }
  }
}

class Tooltip {
  constructor() {
    this.initTooltipHandlers();
  }

  initTooltipHandlers() {
    $(document).ready(() => {
      $('.map__region').click((e) => {
        $('.regions').css('height', '0px');
        $('#' + e.target.id.slice(7)).css('height', 'auto');
      });

      $('.map__region').mousemove((e) => {
        return
        $('#tip-' + e.target.id.slice(7)).css({
          display: "block",
          top: e.pageY + 10 + 'px',
          left: e.pageX + 10 + 'px'
        });
      });

      $('.map__region').mouseout((e) => {
        return
        $('#tip-' + e.target.id.slice(7)).hide();
      });

      $('.map__point').mousemove((e) => {
        const tooltip = $('#tip-' + $(e.currentTarget).data('popup-id'));

        tooltip.css({
          top: e.pageY + 10 + 'px',
          left: e.pageX + 10 + 'px'
        });

        if (tooltip.css('display') === 'none') {
          tooltip.css({
            opacity: 0,
            display: 'block'
          }).animate({ opacity: 1 }, 200);
        }
      });

      $('.map__point').mouseout((e) => {
        const tooltip = $('#tip-' + $(e.currentTarget).data('popup-id'));

        tooltip.animate({ opacity: 0 }, 200, function () {
          $(this).hide();
        });
      });
    });
  }
}