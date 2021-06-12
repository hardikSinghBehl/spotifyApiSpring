jQuery(($) => {

  class SideNav {

    constructor(element, options) {

      this.settings = {
        menuLeftMinBorder: 0.3,
        menuLeftMaxBorder: -0.5,
        menuRightMinBorder: -0.3,
        menuRightMaxBorder: 0.5,
        menuVelocityOffset: 10
      };

      this.defaults = {
        menuWidth: 240,
        edge: 'left',
        closeOnClick: false,
        breakpoint: 1440,
        timeDurationOpen: 300,
        timeDurationClose: 200,
        timeDurationOverlayOpen: 50,
        timeDurationOverlayClose: 200,
        easingOpen: 'easeOutQuad',
        easingClose: 'easeOutCubic',
        showOverlay: true,
        showCloseButton: false,
        slim: false
      };

      this.$element = element;

      this.$elementCloned = element.clone().css({
        display: 'inline-block',
        lineHeight: '24px'
      });

      this.options = this.assignOptions(options);

      this.menuOut = false;
      this.lastTouchVelocity = {
        x: {
          startPosition: 0,
          startTime: 0,
          endPosition: 0,
          endTime: 0
        }
      };

      this.$body = $('body');
      this.$menu = $(`#${this.$element.attr('data-activates')}`);
      this.$sidenavOverlay = $('#sidenav-overlay');
      this.$dragTarget = $('<div class="drag-target"></div>');
      this.$body.append(this.$dragTarget);

    }

    assignOptions(newOptions) {

      return $.extend({}, this.defaults, newOptions);
    }

    init() {
      this.setMenuWidth();
      this.setMenuTranslation();
      this.closeOnClick();
      this.openOnClick();
      this.bindTouchEvents();
      this.showCloseButton();
      this.inputOnClick();
      if (this.options.slim === true) {
        this.handleSlim();
      }
    }

    setMenuWidth() {

      const $sidenavBg = $(`#${this.$menu.attr('id')}`).find('> .sidenav-bg');

      this.$menu.css('width', this.options.menuWidth);
      $sidenavBg.css('width', this.options.menuWidth);

    }

    setMenuTranslation() {

      if (this.options.edge === 'left') {

        this.$menu.css('transform', 'translateX(-100%)');
        this.$dragTarget.css({
          left: 0
        });

      } else {

        this.$menu.addClass('right-aligned').css('transform', 'translateX(100%)');
        this.$dragTarget.css({
          right: 0
        });
      }

      if (!this.$menu.hasClass('fixed')) {
        return;
      }

      if (window.innerWidth > this.options.breakpoint) {

        this.$menu.css('transform', 'translateX(0)');
      }

      this.$menu.find('input[type=text]').on('touchstart', () => {

        this.$menu.addClass('transform-fix-input');
      });

      $(window).on('resize', () => {

        if (window.innerWidth > this.options.breakpoint) {

          if (this.$sidenavOverlay.length) {

            this.removeMenu(true);
          } else {

            this.$menu.css('transform', 'translateX(0%)');
          }
        } else if (this.menuOut === false) {

          const xValue = this.options.edge === 'left' ? '-100' : '100';
          this.$menu.css('transform', `translateX(${xValue}%)`);
        }
      });

    }

    closeOnClick() {

      if (this.options.closeOnClick === true) {

        this.$menu.on('click', 'a:not(.collapsible-header)', () => this.removeMenu());

        if (this.$menu.css('transform') === 'translateX(0)') {
          this.$menu.on('click', () => this.removeMenu());
        }
      }
    }

    openOnClick() {

      // eslint-disable-next-line consistent-return
      this.$element.on('click', e => {

        e.preventDefault();

        if (this.menuOut === true) {
          return this.removeMenu();
        }

        if (this.options.showOverlay === true) {
          if (!$('#sidenav-overlay').length) {
            this.$sidenavOverlay = $('<div id="sidenav-overlay"></div>');
            this.$body.append(this.$sidenavOverlay);
          }
        } else {
          this.showCloseButton();
        }

        let translateX = [];

        if (this.options.edge === 'left') {

          translateX = [0, -1 * this.options.menuWidth];
        } else {

          translateX = [0, this.options.menuWidth];
        }
        if (this.$menu.css('transform') !== 'matrix(1, 0, 0, 1, 0, 0)') {
          this.$menu.velocity({
            translateX
          }, {
            duration: this.options.timeDurationOpen,
            queue: false,
            easing: this.options.easingOpen
          });
        }
        this.$sidenavOverlay.on('click', () => this.removeMenu());

        this.$sidenavOverlay.on('touchmove', this.touchmoveEventHandler.bind(this));
        this.$menu.on('touchmove', e => {

          e.preventDefault();

          this.$menu.find('.custom-scrollbar').css('padding-bottom', '30px');

        });

        this.menuOut = true;

      });
    }

    bindTouchEvents() {

      this.$dragTarget.on('click', () => this.removeMenu());

      this.$dragTarget.on('touchstart', e => {

        this.lastTouchVelocity.x.startPosition = e.touches[0].clientX;
        this.lastTouchVelocity.x.startTime = Date.now();
      });
      this.$dragTarget.on('touchmove', this.touchmoveEventHandler.bind(this));
      this.$dragTarget.on('touchend', this.touchendEventHandler.bind(this));
    }

    showCloseButton() {

      if (this.options.showCloseButton === true) {

        this.$menu.prepend(this.$elementCloned);
        this.$menu.find('.logo-wrapper').css({
          borderTop: '1px solid rgba(153,153,153,.3)'
        });
      }
    }

    inputOnClick() {

      this.$menu.find('input[type=text]').on('touchstart', () => this.$menu.css('transform', 'translateX(0)'));
    }

    removeMenu(restoreMenu) {

      this.$body.css({
        overflow: '',
        width: ''
      });

      this.$menu.velocity({
        translateX: this.options.edge === 'left' ? '-100%' : '100%'
      }, {
        duration: this.options.timeDurationClose,
        queue: false,
        easing: this.options.easingClose,
        complete: () => {
          if (restoreMenu === true) {
            this.$menu.removeAttr('style');
            this.$menu.css('width', this.options.menuWidth);
          }
        }
      });

      this.$menu.removeClass('transform-fix-input');
      this.hideSidenavOverlay();
      this.menuOut = false;
    }

    handleSlim() {

      const $toggle = $('#toggle');
      $toggle.on('click', () => {
        if (this.$menu.hasClass('slim')) {
          this.$menu.removeClass('slim');
          $('.sv-slim-icon').removeClass('fa-angle-double-right').addClass('fa-angle-double-left');
          $('.fixed-sn .double-nav').css({
            transition: 'all .3s ease-in-out',
            'padding-left': '15.9rem'
          });

          $('.fixed-sn main, .fixed-sn footer').css({
            transition: 'all .3s ease-in-out',
            'padding-left': '15rem'
          });

        } else {

          this.$menu.addClass('slim');
          $('.sv-slim-icon').removeClass('fa-angle-double-left').addClass('fa-angle-double-right');
          $('.fixed-sn .double-nav').css('padding-left', '4.6rem');
          $('.fixed-sn main, .fixed-sn footer').css({
            'padding-left': '3.7rem'
          });
        }
      });
    }

    touchmoveEventHandler(e) {

      if (e.type !== 'touchmove') {

        return;
      }

      const [touch] = e.touches;
      let touchX = touch.clientX;

      // calculate velocity every 20ms
      if (Date.now() - this.lastTouchVelocity.x.startTime > 20) {

        this.lastTouchVelocity.x.startPosition = touch.clientX;
        this.lastTouchVelocity.x.startTime = Date.now();
      }

      this.disableScrolling();

      const overlayExists = this.$sidenavOverlay.length !== 0;
      if (!overlayExists) {

        this.buildSidenavOverlay();
      }

      // Keep within boundaries
      if (this.options.edge === 'left') {

        if (touchX > this.options.menuWidth) {

          touchX = this.options.menuWidth;
        } else if (touchX < 0) {

          touchX = 0;
        }
      }

      this.translateSidenavX(touchX);
      this.updateOverlayOpacity(touchX);
    }

    calculateTouchVelocityX() {

      const distance = Math.abs(this.lastTouchVelocity.x.endPosition - this.lastTouchVelocity.x.startPosition);
      const time = Math.abs(this.lastTouchVelocity.x.endTime - this.lastTouchVelocity.x.startTime);

      return distance / time;
    }

    touchendEventHandler(e) {

      if (e.type !== 'touchend') {

        return;
      }

      const touch = e.changedTouches[0];

      this.lastTouchVelocity.x.endTime = Date.now();
      this.lastTouchVelocity.x.endPosition = touch.clientX;
      const velocityX = this.calculateTouchVelocityX();

      const touchX = touch.clientX;
      let leftPos = touchX - this.options.menuWidth;
      let rightPos = touchX - this.options.menuWidth / 2;
      if (leftPos > 0) {
        leftPos = 0;
      }
      if (rightPos < 0) {
        rightPos = 0;
      }

      if (this.options.edge === 'left') {

        // If velocityX <= 0.3 then the user is flinging the menu closed so ignore this.menuOut
        if (this.menuOut || velocityX <= this.settings.menuLeftMinBorder || velocityX < this.options.menuLeftMaxBorder) {

          if (leftPos !== 0) {

            this.translateMenuX([0, leftPos], '300');
          }

          this.showSidenavOverlay();

        } else if (!this.menuOut || velocityX > this.settings.menuLeftMinBorder) {

          this.enableScrolling();
          this.translateMenuX([-1 * this.options.menuWidth - this.options.menuVelocityOffset, leftPos], '200');
          this.hideSidenavOverlay();
        }

        this.$dragTarget.css({
          width: '10px',
          right: '',
          left: 0
        });
      } else if (this.menuOut && velocityX >= this.settings.menuRightMinBorder || velocityX > this.settings.menuRightMaxBorder) {

        this.translateMenuX([0, rightPos], '300');
        this.showSidenavOverlay();

        this.$dragTarget.css({
          width: '50%',
          right: '',
          left: 0
        });
      } else if (!this.menuOut || velocityX < this.settings.menuRightMinBorder) {

        this.enableScrolling();
        this.translateMenuX([this.options.menuWidth + this.options.menuVelocityOffset, rightPos], '200');
        this.hideSidenavOverlay();

        this.$dragTarget.css({
          width: '10px',
          right: 0,
          left: ''
        });
      }
    }

    buildSidenavOverlay() {

      if (this.options.showOverlay === true) {

        this.$sidenavOverlay = $('<div id="sidenav-overlay"></div>');
        this.$sidenavOverlay.css('opacity', 0).on('click', () => this.removeMenu());

        this.$body.append(this.$sidenavOverlay);
      }
    }

    disableScrolling() {

      const oldWidth = this.$body.innerWidth();
      this.$body.css('overflow', 'hidden');
      this.$body.width(oldWidth);
    }

    enableScrolling() {

      this.$body.css({
        overflow: '',
        width: ''
      });
    }

    translateMenuX(fromTo, duration) {

      this.$menu.velocity({
        translateX: fromTo
      }, {
        duration: typeof duration === 'string' ? Number(duration) : duration,
        queue: false,
        easing: this.options.easingOpen
      });
    }

    translateSidenavX(touchX) {

      if (this.options.edge === 'left') {

        const isRightDirection = touchX >= this.options.menuWidth / 2;
        this.menuOut = isRightDirection;

        this.$menu.css('transform', `translateX(${touchX - this.options.menuWidth}px)`);
      } else {

        const isLeftDirection = touchX < window.innerWidth - this.options.menuWidth / 2;
        this.menuOut = isLeftDirection;

        let rightPos = touchX - this.options.menuWidth / 2;
        if (rightPos < 0) {
          rightPos = 0;
        }

        this.$menu.css('transform', `translateX(${rightPos}px)`);
      }
    }

    updateOverlayOpacity(touchX) {

      let overlayPercentage;
      if (this.options.edge === 'left') {

        overlayPercentage = touchX / this.options.menuWidth;
      } else {

        overlayPercentage = Math.abs((touchX - window.innerWidth) / this.options.menuWidth);
      }

      this.$sidenavOverlay.velocity({
        opacity: overlayPercentage
      }, {
        duration: 10,
        queue: false,
        easing: this.options.easingOpen
      });
    }

    showSidenavOverlay() {

      if (this.options.showOverlay === true && !$('#sidenav-overlay').length) {
        this.buildSidenavOverlay();
      }

      this.$sidenavOverlay.velocity({
        opacity: 1
      }, {
        duration: this.options.timeDurationOverlayOpen,
        queue: false,
        easing: this.options.easingOpen
      });
    }

    hideSidenavOverlay() {

      this.$sidenavOverlay.velocity({
        opacity: 0
      }, {
        duration: this.options.timeDurationOverlayClose,
        queue: false,
        easing: this.options.easingOpen,
        complete() {
          $(this).remove();
        }
      });
    }

  }

  $.fn.sideNav = function (options) {
    $(this).each(function () {
      const sidenav = new SideNav($(this), options);
      sidenav.init();
    });
  };

  $('.side-nav').on('touchmove', function (e) {
    e.stopPropagation();
  }, false);

});
