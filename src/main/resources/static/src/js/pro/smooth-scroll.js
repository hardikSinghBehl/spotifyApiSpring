const SMOOTH_SCROLL_DURATION = 700;

$('.smooth-scroll').on('click', 'a', function () {

  const elAttr = $(this).attr('href');
  if (typeof elAttr !== typeof undefined && elAttr.indexOf('#') === 0) {

    const offset = $(this).attr('data-offset') ? $(this).attr('data-offset') : 0;
    const setHash = $(this).parentsUntil('.smooth-scroll').last().parent().attr('data-allow-hashes');

    $('body,html').animate({
      scrollTop: $(elAttr).offset().top - offset
    }, SMOOTH_SCROLL_DURATION);

    if (typeof setHash !== typeof undefined && setHash !== false) {

      history.replaceState(null, null, elAttr);
    }

    return false;
  }
});
