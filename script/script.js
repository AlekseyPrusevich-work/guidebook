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

      $(document).on('click', '.popup__button', (e) => {
          this.handleNavigation($(e.target));
      });

      $(document).on('click', '.popup__progress-item', (e) => {
          const stepNumber = $(e.target).data('step');
          if (stepNumber) {
              this.goToStep(stepNumber, $(e.target).closest('.overlay'));
          }
      });
  }

  openPopup(popupId) {
      const $popup = $(`#popup-${popupId}`);
      this.resetPopup($popup);
      $popup.fadeIn(200);
      $('body').css('overflow', 'hidden');

      this.updateProgress(1, $popup);
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
      // Скрываем все шаги
      $popup.find('.popup__step').removeClass('active');
      // Показываем только первый шаг
      $popup.find('.popup__step[data-step="1"]').addClass('active');
  }

  // Обработка навигации
  handleNavigation($button) {
      const $currentStep = $button.closest('.popup__step');
      const nextStepNumber = $button.data('next');
      const $popup = $button.closest('.overlay');
      
      if (nextStepNumber) {
          this.goToStep(nextStepNumber, $popup);
      }
  }

  // Переход к конкретному шагу
  goToStep(stepNumber, $popup) {
      const $steps = $popup.find('.popup__step');
      const $targetStep = $popup.find(`.popup__step[data-step="${stepNumber}"]`);
      
      if ($targetStep.length) {
          // Скрываем текущий шаг
          $steps.removeClass('active');
          
          // Показываем целевой шаг
          $targetStep.addClass('active');
          
          // Обновляем прогресс
          this.updateProgress(stepNumber, $popup);
      }
  }

  // Обновление индикатора прогресса
  updateProgress(currentStep, $popup) {
      const $progressItems = $popup.find('.popup__progress-item');
      
      $progressItems.each(function() {
          const itemStep = $(this).data('step');
          $(this).removeClass('active completed');
          
          if (itemStep == currentStep) {
              $(this).addClass('active');
          } else if (itemStep < currentStep) {
              $(this).addClass('completed');
          }
      });
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