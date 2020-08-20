// 'use strict';
let loader_path = '../dev/dist/mdb-addons/preloader.html';
let windowLoaded = false;

$(window).on('load', function () {

  windowLoaded = true;

});

$(document).ready(function () {

  $('body').attr('aria-busy', true);

  $('#preloader-markup').load(loader_path, function () {

    if (windowLoaded) {
    
      $('#mdb-preloader').fadeOut('slow');
      $('body').removeAttr('aria-busy');
    
    } else {
    
      $(window).on('load', function () {
    
        $('#mdb-preloader').fadeOut('slow');
        $('body').removeAttr('aria-busy');
    
      });
    }

  });

});
