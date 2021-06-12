jQuery(function ($) {

  $(document).on('click.card', '.card', function (e) {

    const $this = $(this);
    const $reveal = $this.find('.card-reveal');

    if ($reveal.length) {

      const $clickedElem = $(e.target);
      const isTitleClicked = $clickedElem.is('.card-reveal .card-title');
      const isTitleIconClicked = $clickedElem.is('.card-reveal .card-title i');
      const isActivatorClicked = $clickedElem.is('.card .activator');
      const isActivatorIconClicked = $clickedElem.is('.card .activator i');

      if (isTitleClicked || isTitleIconClicked) {
        takeRevealDown($reveal);
      } else if (isActivatorClicked || isActivatorIconClicked) {
        takeRevealUp($reveal);
      }
    }
  });

  const takeRevealUp = (revealElem) => {

    revealElem.css({
      display: 'block'
    }).velocity({
      translateY: '-100%'
    }, {
      duration: 300,
      queue: false,
      easing: 'easeInOutQuad'
    });
  };

  const takeRevealDown = (revealElem) => {

    revealElem.velocity({
      translateY: 0
    }, {
      duration: 225,
      queue: false,
      easing: 'easeInOutQuad',
      complete: function complete() {
        revealElem.css({
          display: 'none'
        });
      }
    });
  };

  $('.rotate-btn').on('click', function () {

    $(this).closest('.card').toggleClass('flipped');

  });

  $(window).on('load', function () {

    const $rotatingCards = $('.card-rotating');
    $rotatingCards.each(function () {
      const $this = $(this);

      const $cardWrapper = $this.parent();
      const $front = $this.find('.front');
      const $back = $this.find('.back');
      const $frontHeight = $this.find('.front').outerHeight();
      const $backHeight = $this.find('.back').outerHeight();

      if ($frontHeight > $backHeight) $($cardWrapper, $back).height($frontHeight);
      else if ($frontHeight < $backHeight) $($cardWrapper, $front).height($backHeight);
      else $($cardWrapper).height($backHeight);
    });

  });

  $('.card-share > a').on('click', function (e) {

    e.preventDefault();

    $(this)
      .toggleClass('share-expanded')
      .parent()
      .find('div')
      .toggleClass('social-reveal-active');
  });

  $('.map-card').on('click', function () {
    $(this).find('.card-body').toggleClass('closed');
  });

});
