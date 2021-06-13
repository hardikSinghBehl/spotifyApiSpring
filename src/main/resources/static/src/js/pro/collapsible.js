jQuery(function ($) {

  $.fn.collapsible = function (options) {

    const defaults = {
      accordion: undefined
    };

    options = $.extend(defaults, options);

    return this.each(function () {

      const $this = $(this);

      let $panelHeaders = $this.find('> li > .collapsible-header');

      const collapsibleType = $this.data('collapsible');

      $this.off('click.collapse', '.collapsible-header');
      $panelHeaders.off('click.collapse');


      if (options.accordion || collapsibleType === 'accordion' || collapsibleType === undefined) {

        $panelHeaders.on('click.collapse', (e) => {

          let element = $(e.target);

          if (isChildOfPanelHeader(element)) {

            element = getPanelHeader(element);
          }

          element.toggleClass('active');
          accordionOpen($this, element);
        });

        accordionOpen($this, $panelHeaders.filter('.active').first());
      } else {

        $panelHeaders.each(function () {

          $(this).on('click.collapse', (e) => {

            let element = $(e.target);
            if (isChildOfPanelHeader(element)) {

              element = getPanelHeader(element);
            }
            element.toggleClass('active');
            expandableOpen(element);
          });

          if ($(this).hasClass('active')) {

            expandableOpen($(this));
          }

        });
      }
    });
  };

  function accordionOpen($collapsible, object) {

    let $panelHeaders = $collapsible.find('> li > .collapsible-header');

    expandableOpen(object)

    $panelHeaders.not(object)
      .removeClass('active')
      .parent()
      .removeClass('active')
      .children('.collapsible-body')
      .stop(true, false)
      .slideUp({
        duration: 350,
        easing: 'easeOutQuart',
        queue: false,
        complete() {
          $(this).css('height', '');
        }
      });

  }

  function expandableOpen(object) {

    object.hasClass('active') ? object.parent().addClass('active') : object.parent().removeClass('active');

    object.parent().hasClass('active') ? (
      object.siblings('.collapsible-body').stop(true, false).slideDown({
        duration: 350,
        easing: 'easeOutQuart',
        queue: false,
        complete() {

          $(this).css('height', '');
        }
      })
    ) : (
      object.siblings('.collapsible-body').stop(true, false).slideUp({
        duration: 350,
        easing: 'easeOutQuart',
        queue: false,
        complete() {
          $(this).css('height', '');
        }
      })
    );
  }

  function isChildOfPanelHeader(object) {

    const $panelHeader = getPanelHeader(object);
    return $panelHeader.length > 0;
  }

  function getPanelHeader(object) {

    return object.closest('li > .collapsible-header');
  }

  $('.collapsible').collapsible();

});
