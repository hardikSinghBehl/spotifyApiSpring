jQuery(($) => {

  class Sticky {

    constructor(element, options) {

      this.defaults = {
        topSpacing: 0,
        zIndex: false,
        stopper: '#footer',
        stickyClass: false,
        startScrolling: 'top',
        minWidth: false
      };

      this.$element = element;
      this.options = this.assignOptions(options);

      this.$window = $(window);

      this.stopper = this.options.stopper;
      this.elementWidth = this.$element.outerWidth();
      this.elementHeight = this.$element.outerHeight(true);

      this.initialScrollTop = this.$element.offset().top;

      this.$placeholder = $('<div class="sticky-placeholder"></div>');
      this.scrollTop = 0;

      this.setPushPoint();
      this.setStopperPosition();
      this.bindEvents();

    }

    hasZIndex() {

      return typeof this.options.zIndex === 'number';
    }

    hasStopper() {

      return $(this.options.stopper).length || typeof this.options.stopper === 'number';
    }

    isScreenHeightEnough() {

      return this.$element.outerHeight() + this.options.topSpacing < this.$window.height();
    }

    assignOptions(options) {

      return $.extend({}, this.defaults, options);
    }

    setPushPoint() {

      if (this.options.startScrolling === 'bottom' && !this.isScreenHeightEnough()) {

        this.$pushPoint = this.initialScrollTop + this.$element.outerHeight(true) - this.$window.height();
      } else {

        this.$pushPoint = this.initialScrollTop - this.options.topSpacing;
      }

    }

    setStopperPosition() {

      if (typeof this.options.stopper === 'string') {

        this.stopPoint = $(this.stopper).offset().top - this.options.topSpacing;

      } else if (typeof this.options.stopper === 'number') {

        this.stopPoint = this.options.stopper;
      }
    }

    bindEvents() {

      this.$window.on('resize', this.handleResize.bind(this));
      this.$window.on('scroll', this.init.bind(this));

    }

    handleResize() {

      const $parent = this.$element.parent();

      this.elementWidth = $parent.width();
      this.elementHeight = this.$element.outerHeight(true);

      this.setPushPoint();
      this.setStopperPosition();

      this.init();
    }

    // eslint-disable-next-line consistent-return
    init() {

      if (this.options.minWidth && this.options.minWidth > this.$window.innerWidth()) {

        return false;
      }

      if (this.options.startScrolling === 'bottom' && !this.isScreenHeightEnough()) {
        this.scrollTop = this.$window.scrollTop() + this.$window.height();
      } else {
        this.scrollTop = this.$window.scrollTop();
      }

      if (this.$pushPoint < this.scrollTop) {

        this.appendPlaceholder();
        this.stickyStart();

      } else {

        this.stickyEnd();
      }

      if (this.$window.scrollTop() > this.$pushPoint) {
        this.stop();
      } else {
        this.stickyEnd();
      }

    }

    appendPlaceholder() {

      this.$element.after(this.$placeholder);
      this.$placeholder.css({
        width: this.elementWidth,
        height: this.elementHeight
      });
    }

    stickyStart() {

      if (this.options.stickyClass) {

        this.$element.addClass(this.options.stickyClass);
      }

      // @see: https://stackoverflow.com/a/4370047
      this.$element.get(0).style.overflow = 'scroll';
      const scrollHeight = this.$element.get(0).scrollHeight;
      this.$element.get(0).style.overflow = '';

      this.$element.css({
        position: 'fixed',
        width: this.elementWidth,
        height: scrollHeight
      });

      if (this.options.startScrolling === 'bottom' && !this.isScreenHeightEnough()) {

        this.$element.css({
          bottom: 0,
          top: ''
        });

      } else {

        this.$element.css({
          top: this.options.topSpacing
        });
      }

      if (this.hasZIndex()) {
        this.$element.css({
          zIndex: this.options.zIndex
        });
      }
    }

    stickyEnd() {

      if (this.options.stickyClass) {
        this.$element.removeClass(this.options.stickyClass);
      }

      this.$placeholder.remove();

      this.$element.css({
        position: 'static',
        top: this.options.topSpacing,
        width: '',
        height: ''
      });
    }

    stop() {

      if (this.stopPoint < $(this.$element).offset().top + this.$element.outerHeight(true)) {

        this.$element.css({
          position: 'absolute',
          bottom: 0,
          top: ''
        });
      }
    }

  }

  $.fn.sticky = function (options) {
    $(this).each(function () {
      const sticky = new Sticky($(this), options);
      sticky.init();
    });
  };
});
