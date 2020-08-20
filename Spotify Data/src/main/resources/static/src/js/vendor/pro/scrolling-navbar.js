/* SCROLLING NAVBAR */
const OFFSET_TOP = 50

$(window).scroll(function () {
    if($('.navbar').length) {
      if ($('.navbar').offset().top > OFFSET_TOP) {
        $('.scrolling-navbar').addClass("top-nav-collapse");
      } else {
        $('.scrolling-navbar').removeClass("top-nav-collapse");
      }
    }
});
