jQuery(($) => {

  class Dropdown {

    constructor($activator, options = {}) {

      this.$activator = $activator;
      this.$activates = $(`#${$activator.attr('data-activates')}`);
      /* eslint-disable newline-per-chained-call */
      this.options = {
        inDuration: this.fallback().or($activator.data('induration')).or($activator.attr('data-in-duration')).or(options.inDuration).or(300).value(),
        outDuration: this.fallback().or($activator.data('outduration')).or($activator.attr('data-out-duration')).or(options.outDuration).or(225).value(),
        easingEffectIn: this.fallback().or($activator.data('easingeffectin')).or($activator.attr('data-easing-effect-in')).or(options.easingEffectIn).or('easeOutCubic').value(),
        easingEffectOut: this.fallback().or($activator.data('easingeffectout')).or($activator.attr('data-easing-effect-out')).or(options.easingEffectOut).or('swing').value(),
        constrainWidth: this.fallback().or($activator.data('constrainwidth')).or($activator.attr('data-constrain-width')).or(options.constrainWidth).or(true).value(),
        hover: this.fallback().or($activator.data('hover')).or($activator.attr('data-hover')).or(options.hover).or(false).value(),
        gutter: this.fallback().or($activator.data('gutter')).or($activator.attr('data-gutter')).or(options.gutter).or(0).value(),
        belowOrigin: this.fallback().or($activator.data('beloworigin')).or($activator.attr('data-below-origin')).or(options.belowOrigin).or(false).value(),
        alignment: this.fallback().or($activator.data('alignment')).or($activator.attr('data-alignment')).or(options.alignment).or('left').value(),
        maxHeight: this.fallback().or($activator.data('maxheight')).or($activator.attr('data-max-height')).or(options.maxHeight).or('').value(),
        resetScroll: this.fallback().or($activator.data('resetscroll')).or($activator.attr('data-reset-scroll')).or(options.resetScroll).or(true).value()
      };
      /* eslint-enable newline-per-chained-call */
      this.isFocused = false;
    }

    static mdbDropdownAutoInit() {

      $('.dropdown-button').dropdown();

      this.bindMultiLevelDropdownEvents();
      this.bindBootstrapEvents();
    }

    static bindMultiLevelDropdownEvents() {

      const $multiLevelDropdown = $('.multi-level-dropdown');
      $multiLevelDropdown.find('.dropdown-submenu > a').on('mouseenter', function (e) {

        const $submenu = $(this);

        $multiLevelDropdown.find('.dropdown-submenu .dropdown-menu').removeClass('show');
        $submenu.next('.dropdown-menu').addClass('show');

        e.stopPropagation();
      });

      $multiLevelDropdown.find('.dropdown').on('hidden.bs.dropdown', () => {
        $multiLevelDropdown.find('.dropdown-menu.show').removeClass('show');
      });
    }

    static bindBootstrapEvents() {

      const $dropdowns = $('.dropdown, .dropup');
      $dropdowns.on({
        'show.bs.dropdown': (e) => {

          const $dropdown = $(e.target);
          const effects = this._getDropdownEffects($dropdown);
          this._dropdownEffectStart($dropdown, effects.effectIn);
        },
        'shown.bs.dropdown': (e) => {

          const $dropdown = $(e.target);
          const effects = this._getDropdownEffects($dropdown);
          if (effects.effectIn && effects.effectOut) {

            this._dropdownEffectEnd($dropdown, effects);
          }
        },
        'hide.bs.dropdown': (e) => {

          const $dropdown = $(e.target);
          const effects = this._getDropdownEffects($dropdown);
          if (effects.effectOut) {

            e.preventDefault();

            this._dropdownEffectStart($dropdown, effects.effectOut);
            this._dropdownEffectEnd($dropdown, effects, () => {

              $dropdown.removeClass('show');
              $dropdown.find('.dropdown-menu').removeClass('show');
            });
          }
        }
      });
    }

    static _getDropdownEffects($dropdown) {

      let defaultInEffect = 'fadeIn';
      let defaultOutEffect = 'fadeOut';
      const $dropdownMenu = $dropdown.find('.dropdown-menu');
      const $parentUl = $dropdown.parents('ul.nav');

      if ($parentUl.height > 0) {

        defaultInEffect = $parentUl.data('dropdown-in') || null;
        defaultOutEffect = $parentUl.data('dropdown-out') || null;
      }

      return {
        effectIn: $dropdownMenu.data('dropdown-in') || defaultInEffect,
        effectOut: $dropdownMenu.data('dropdown-out') || defaultOutEffect
      };
    }

    static _dropdownEffectStart($dropdown, effectToStart) {

      if (effectToStart) {

        $dropdown.addClass('dropdown-animating');
        $dropdown.find('.dropdown-menu').addClass(['animated', effectToStart].join(' '));
      }
    }

    static _dropdownEffectEnd($dropdown, effects, callback) {

      $dropdown.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {

        $dropdown.removeClass('dropdown-animating');
        $dropdown.find('.dropdown-menu').removeClass(['animated', effects.effectIn, effects.effectOut].join(' '));

        if (typeof callback === 'function') {

          callback();
        }
      });
    }

    returnPublicInterface() {

      return {
        $activator: this.$activator,
        $activates: this.$activates,
        updatePosition: this.updatePosition.bind(this)
      };
    }

    init() {

      this.appendDropdownToActivator();

      if (this.options.hover) {

        this.handleHoverableDropdown();

      } else {

        this.handleClickableDropdown();
      }

      this.bindEvents();
    }

    appendDropdownToActivator() {

      this.$activator.after(this.$activates);
    }

    handleHoverableDropdown() {

      let opened = false;

      this.$activator.unbind(`click.${this.$activator.attr('id')}`);

      this.$activator.on('mouseenter', () => {

        if (opened === false) {

          this.placeDropdown();
          opened = true;
        }
      });

      this.$activator.on('mouseleave', (e) => {

        const toEl = e.toElement || e.relatedTarget;
        const mouseHoversDropdown = $(toEl).closest('.dropdown-content').is(this.$activates);
        if (!mouseHoversDropdown) {

          this.$activates.stop(true, true);
          this.hideDropdown();
          opened = false;
        }
      });

      this.$activates.on('mouseleave', (e) => {

        const toEl = e.toElement || e.relatedTarget;
        const mouseHoversActivator = $(toEl).closest('.dropdown-button').is(this.$activator);
        if (!mouseHoversActivator) {

          this.$activates.stop(true, true);
          this.hideDropdown();
          opened = false;
        }
      });
    }

    handleClickableDropdown() {

      this.$activator.unbind(`click.${this.$activator.attr('id')}`);
      this.$activator.bind(`click.${this.$activator.attr('id')}`, (e) => {

        if (this.isFocused) {

          return;
        }

        const activatorClicked = this.$activator.get(0) === e.currentTarget;
        const activatorActive = this.$activator.hasClass('active');
        const dropdownContentClicked = $(e.target).closest('.dropdown-content').length !== 0;
        if (activatorClicked && !activatorActive && !dropdownContentClicked) {

          e.preventDefault();
          this.placeDropdown('click');
        } else if (activatorActive) {

          this.hideDropdown();
          $(document).unbind(`click.${this.$activates.attr('id')} touchstart.${this.$activates.attr('id')}`);
        }

        if (this.$activates.hasClass('active')) {

          $(document).bind(`click.${this.$activates.attr('id')} touchstart.${this.$activates.attr('id')}`, (e) => {

            const clickedOutsideDropdown = !this.$activates.is(e.target) && !this.$activator.is(e.target) && !this.$activator.find(e.target).length;
            if (clickedOutsideDropdown) {

              this.hideDropdown();
              $(document).unbind(`click.${this.$activates.attr('id')} touchstart.${this.$activates.attr('id')}`);
            }
          });
        }
      });
    }

    bindEvents() {

      this.$activator.on('open', (e, eventType) => {

        this.placeDropdown(eventType);
      });

      this.$activator.on('close', this.hideDropdown.bind(this));
    }

    placeDropdown(eventType) {

      if (eventType === 'focus') {

        this.isFocused = true;
      }

      this.$activates.addClass('active');
      this.$activator.addClass('active');

      if (this.options.constrainWidth === true) {

        this.$activates.css('width', this.$activator.outerWidth());
      } else {

        this.$activates.css('white-space', 'nowrap');
      }

      this.updatePosition();

      this.showDropdown();
    }

    showDropdown() {

      this.$activates.stop(true, true).css('opacity', 0)
        .slideDown({
          queue: false,
          duration: this.options.inDuration,
          easing: this.options.easingEffectIn,
          complete() {
            $(this).css('height', '');
          }
        })
        .animate({
          opacity: 1,
          // eslint-disable-next-line object-curly-newline
          ...this.options.resetScroll && { scrollTop: 0 }
        }, {
          queue: false,
          duration: this.options.inDuration,
          easing: 'easeOutSine'
        });
    }

    hideDropdown() {

      this.isFocused = false;
      this.$activates.fadeOut({
        durations: this.options.outDuration,
        easing: this.options.easingEffectOut
      });
      this.$activates.removeClass('active');
      this.$activator.removeClass('active');

      setTimeout(() => {
        this.$activates.css('max-height', this.options.maxHeight);
      }, this.options.outDuration);
    }

    updatePosition() {

      const windowHeight = window.innerHeight;
      const originHeight = this.$activator.innerHeight();
      const offsetTop = this.$activator.offset().top - $(window).scrollTop();

      const currAlignment = this._getHorizontalAlignment();
      let gutterSpacing = 0;
      let leftPosition = 0;

      const $wrapper = this.$activator.parent();
      let verticalOffset = this.options.belowOrigin ? originHeight : 0;
      const scrollOffset = !$wrapper.is('body') && $wrapper.get(0).scrollHeight > $wrapper.get(0).clientHeight ? $wrapper.get(0).scrollTop : 0;

      const doesNotFitFromBottom = offsetTop + this.$activates.innerHeight() > windowHeight;
      const doesNotFitFromTop = offsetTop + originHeight - this.$activates.innerHeight() < 0;
      if (doesNotFitFromBottom && doesNotFitFromTop) {

        const adjustedHeight = windowHeight - offsetTop - verticalOffset;
        this.$activates.css('max-height', adjustedHeight);
      } else if (doesNotFitFromBottom) {

        if (!verticalOffset) {
          verticalOffset += originHeight;
        }

        verticalOffset -= this.$activates.innerHeight();
      }

      if (currAlignment === 'left') {

        gutterSpacing = this.options.gutter;
        leftPosition = this.$activator.position().left + gutterSpacing;
      } else if (currAlignment === 'right') {

        const offsetRight = this.$activator.position().left + this.$activator.outerWidth() - this.$activates.outerWidth();
        gutterSpacing = -this.options.gutter;
        leftPosition = offsetRight + gutterSpacing;
      }

      this.$activates.css({
        position: 'absolute',
        top: this.$activator.position().top + verticalOffset + scrollOffset,
        left: leftPosition
      });
    }

    _getHorizontalAlignment() {

      const offsetLeft = this.$activator.offset().left;

      if (offsetLeft + this.$activates.innerWidth() > $(window).width()) {

        return 'right';
      } else if (offsetLeft - this.$activates.innerWidth() + this.$activator.innerWidth() < 0) {

        return 'left';
      }

      return this.options.alignment;
    }

    fallback() {

      return {
        _value: undefined,
        or(value) {
          if (typeof value !== 'undefined' && typeof this._value === 'undefined') {
            this._value = value;
          }
          return this;
        },
        value() {
          return this._value;
        }
      };
    }
  }

  $.fn.scrollTo = function (elem) {

    this.scrollTop(this.scrollTop() - this.offset().top + $(elem).offset().top);
    return this;
  };

  $.fn.dropdown = function (options) {

    if (this.length > 1) {

      const instances = [];

      this.each(function () {

        const dropdown = new Dropdown(this, options);
        dropdown.init();

        instances.push(dropdown.returnPublicInterface());
      });

      return instances;
    }

    const dropdown = new Dropdown(this, options);
    dropdown.init();

    return dropdown.returnPublicInterface();
  };

  Dropdown.mdbDropdownAutoInit();
});
