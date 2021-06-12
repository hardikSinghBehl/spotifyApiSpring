/*
 * MDBootstrap Range Slider
 * Learn more:  https://mdbootstrap.com/plugins/jquery/multi-range/,
 *
 * About MDBootstrap: https://mdbootstrap.com/
 * Support: https://mdbootstrap.com/support/
 * Contact: https://mdbootstrap.com/contact/
 *
 * This addons was created by MDBootstrap Developer Team
 *
 */

($ => {
  class mdbRange {

    constructor(range, options) {

      this.defaults = {
        width: '100%',
        direction: 'vertical',
        value: {
          min: 0,
          max: 100
        },
        single: {
          active: true,
          value: {
            step: 1,
            symbol: ''
          },
          counting: false,
          countingTarget: null,
          bgThumbColor: '#4285F4',
          textThumbColor: '#fff',
          multi: {
            active: false,
            value: {
              step: 1,
              symbol: ''
            },
            counting: false,
            rangeLength: 0,
            countingTarget: null,
            bgThumbColor: '#4285F4',
            textThumbColor: '#fff'
          }
        }
      };

      this.$range = range;
      this.options = this.assignedOptions(options);
      this.$rangeWrapper = this.$range.parent().hasClass('multi-range-field') ? this.$range.parent() : null;
      this.thumbHtml = '<span class="thumb"><span class="value"></span></span>';
      this.rangeMousedown = false;
      this.left;
      this.init();
    }

    assignedOptions(newOptions) {
      return $.extend({}, this.defaults, newOptions);
    }

    init() {

      this.addThumb();
      this.rangeChange();
      this.multiRangeInit();
      this.inputMouseDown();
      this.mouseUponInput();
      this.mouseMoveOnInput();
      this.mouseOutFromInput();
      this.multiRangeValue();
      this.multiRangeCSS();
      this.inputMultiRange();
    }

    randomLetter(...letter) {

      let text = '';
      const charset = 'abcdefghijklmnopqrstuvwxyz123456789';

      for (let i = 0; i < new Number(letter); i++) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return text;
    }

    addThumb() {

      if (this.options.single.active === true) {

        $(this.$range.prop({
          id: this.randomLetter(10),
          disabled: false
        })).after($(this.thumbHtml).attr('data-id', ''));
      } else {

        $(this.$range.prop('disabled', true));
      }

      this.options.direction === 'horizontal' ? this.$rangeWrapper.addClass('thumb-horizontal-wrapper') : null;
    }

    rangeChange() {

      this.$range.on('change', e => {

        e.preventDefault();

        const $etarget = $(e.target);

        const $thumbValue = $etarget.siblings('.thumb').find('.value');

        this.options.single.value !== undefined ? $thumbValue.html(`${$etarget.val()} ${this.options.single.value.symbol}`) : $thumbValue.html($etarget.val());
      });
    }

    multiRangeInit() {

      this.$range.attr({
        min: this.options.value.min,
        max: this.options.value.max,
        step: this.options.single.value !== undefined ? this.options.single.value.step : this.defaults.single.value.step,
        symbol: this.options.single.value !== undefined ? this.options.single.value.symbol : this.defaults.single.value.symbol
      });

      this.$range.addClass('mdbMultiRange original');
      this.$range.val(this.$range.attr('min'));
    }

    inputMouseDown() {

      this.$range.on('input mousedown touchstart', e => {

        const $etarget = $(e.target);
        const $thumb = $etarget.siblings('.thumb');

        if (!$thumb.length) {

          this.addThumb();
        }

        $thumb.find('.value').html($etarget.val());

        this.rangeMousedown = true;
        $etarget.addClass('active');

        if (!$thumb.hasClass('active')) {

          $thumb.css({
            height: '30px',
            width: '30px',
            top: '-23px',
            marginLeft: '-15px'
          });
        }

        if (e.type !== 'input') {

          let page = e.pageY;
          let offset = $etarget.offset().top;
          const width = $etarget.outerWidth();

          this.options.direction === 'horizontal' ? page : page = e.pageX;
          this.options.direction === 'horizontal' ? offset : offset = $etarget.offset().left;

          if (page === undefined || page === null) {

            let originalEventTouch = e.originalEvent.touches[0].pageY;

            this.options.direction === 'horizontal' ? originalEventTouch : originalEventTouch = e.originalEvent.touches[0].pageX;

            this.left = originalEventTouch - offset;

          } else {
            this.left = page - offset;
          }

          if (this.left < 0) {

            this.left = 0;
          } else if (this.left > width) {

            this.left = width;
          }
          $thumb.addClass('active').css('left', this.left);
        }

        $thumb.attr('data-id', $etarget.attr('id'));

        if ($etarget.hasClass('ghost')) {

          $thumb.css('background-color', $etarget.data('color'));
          $thumb.children().css('color', $etarget.data('text-color'));
        } else {

          $thumb.css('background-color', this.options.single.bgThumbColor === undefined ? this.defaults.single.bgThumbColor : this.options.single.bgThumbColor);
          $thumb.children().css('color', this.options.single.textThumbColor === undefined ? this.defaults.single.textThumbColor : this.options.single.textThumbColor);
        }

        this.options.single.value !== undefined ? $thumb.find('.value').html(`${$etarget.val()} ${this.options.single.value.symbol}`) : $thumb.find('.value').html($etarget.val());
      });
    }

    mouseUponInput() {

      this.$range.on('mouseup', e => {

        this.rangeMousedown = false;
        $(e.target).parent().removeClass('active');
      });
    }

    mouseMoveOnInput() {

      this.$range.on('mousemove touchmove', e => {

        const $etarget = $(e.target);
        const $thumb = $etarget.siblings('.thumb');

        this.left;

        if (this.rangeMousedown) {

          if (!$thumb.hasClass('active')) {

            $thumb.css({
              height: '30px',
              width: '30px',
              top: '-23px',
              marginLeft: '-15px'
            });
          }

          const width = $etarget.outerWidth();
          let page = e.pageY;
          let offset = $etarget.offset().top;

          this.options.direction === 'horizontal' ? page : page = e.pageX;
          this.options.direction === 'horizontal' ? offset : offset = $etarget.offset().left;
          this.options.direction === 'horizontal' ? $thumb.addClass('active thumb-horizontal') : $thumb.addClass('active');

          if (page === undefined || page === null) {

            let originalEventTouch = e.originalEvent.touches[0].pageY;

            this.options.direction === 'horizontal' ? originalEventTouch : originalEventTouch = e.originalEvent.touches[0].pageX;

            this.left = originalEventTouch - offset;
          } else {

            this.left = page - offset;
          }

          if (this.left < 0) {

            this.left = 0;
          } else if (this.left > width) {

            this.left = width;
          }

          $thumb.css('left', this.left);

          if ($etarget.length < 1) {
            $thumb.find('.value').html(`${$etarget.val()} ${this.options.single.value.symbol}`);
          }
        }
      });
    }

    mouseOutFromInput() {

      this.$range.on('mouseout touchend', e => {

        if (!this.rangeMousedown) {

          this.hasClassActive(e);
        } else {

          this.hasClassActive(e);
        }
      });
    }

    hasClassActive(e) {

      const $thumb = $(e.target).siblings('.thumb');

      if ($thumb.hasClass('active')) {

        $thumb.animate({
          marginLeft: '0px',
          top: '12px',
          height: '0px',
          width: '0px'
        }, 230);

      }
      $thumb.removeClass('active');
    }

    multiRangeValue() {

      if (this.options.single.countingTarget !== null && this.options.single.countingTarget !== undefined && this.options.single.countingTarget !== '' && this.options.single.counting === true) {

        const $orginalTarget = $(`${[...this.options.single.countingTarget.split(' ')]}`);

        this.$range.on('input mousedown touchstart', () => {

          if (this.options.single.value !== undefined && !$orginalTarget.is('input')) {

            $orginalTarget.html(`${this.$range.val()} ${this.options.single.value.symbol}`);
          } else if ($orginalTarget.is('input')) {

            $orginalTarget.val(`${this.$range.val()}`);
          } else {

            $orginalTarget.html(`${this.$range.val()}`);
          }
        });
      }
    }

    multiRangeCSS() {

      this.$range.css('width', this.options.width);
    }

    inputMultiRange() {

      if (this.options.single.multi !== undefined && this.options.single.active === true && this.options.single.multi.rangeLength >= 1) {

        for (let i = 0; i < this.options.single.multi.rangeLength; i++) {

          const $ghost = this.$range.clone(true, true).prop('id', this.randomLetter(10));

          if (this.options.single.multi.bgThumbColor !== undefined && this.options.single.multi.textThumbColor !== undefined && this.options.single.multi.bgThumbColor.length > 1) {

            $ghost.attr({
              'data-color': this.options.single.multi.bgThumbColor.length > 1 ? [...this.options.single.multi.bgThumbColor][i] : [...this.options.single.multi.bgThumbColor][0],
              'data-text-color': this.options.single.multi.textThumbColor.length > 1 ? [...this.options.single.multi.textThumbColor][i] : [...this.options.single.multi.textThumbColor][0]
            });
          } else {

            $ghost.attr({
              'data-color': [],
              'data-text-color': []
            });
          }

          $ghost.attr({
            step: this.options.single.multi.value !== undefined ? this.options.single.multi.value.step : null,
            symbol: this.options.single.multi.value !== undefined ? this.options.single.multi.value.symbol : null
          });

          $ghost.val($ghost.attr('max'));
          $ghost.addClass('mdbMultiRange ghost');
          $ghost.prev().css('background-color', this.options.single.multi.bgThumbColor);
          this.$range.after($ghost);

          if (this.options.single.multi.countingTarget !== null && this.options.single.multi.countingTarget !== undefined && typeof this.options.single.multi.countingTarget === 'object' && this.options.single.multi.counting) {

            const $ghostTargetValue = $(`${Object.values([...this.options.single.multi.countingTarget])[i]}`);

            $ghost.on('input mousedown', e => {

              if (this.options.single.multi.value !== undefined && !$ghostTargetValue.is('input')) {

                $ghostTargetValue.html(`${$(e.target).val()} ${this.options.single.multi.value.symbol}`);
              } else if ($ghostTargetValue.is('input')) {

                $ghostTargetValue.val($(e.target).val());
              } else {
                $ghostTargetValue.html($(e.target).val());
              }
            });
          }
        }
      }
    }
  }

  $.fn.mdbRange = function (options) {

    return this.each(function () {
      new mdbRange($(this), options);
    });
  };

})(jQuery);
