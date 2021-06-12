(($) => {

  const inputData = {};
  const dataColor = '';
  const buttonCloseColor = '';
  const buttonCloseBlurColor = '#ced4da';
  const inputFocus = '1px solid #4285f4';
  const inputBlur = '1px solid #ced4da';
  const inputFocusShadow = '0 1px 0 0 #4285f4';
  const inputBlurShadow = '';
  const enterCharCode = 13;
  const arrowUpCharCode = 38;
  const arrowDownCharCode = 40;
  let count = -1;
  let nextScrollHeight = -45;

  class mdbAutocomplete {

    constructor(input, options) {

      this.defaults = {
        data: inputData,
        dataColor: dataColor,
        closeColor: buttonCloseColor,
        closeBlurColor: buttonCloseBlurColor,
        inputFocus: inputFocus,
        inputBlur: inputBlur,
        inputFocusShadow: inputFocusShadow,
        inputBlurShadow: inputBlurShadow
      };

      this.$input = input;
      this.options = this.assignOptions(options);
      this.$clearButton = $('.mdb-autocomplete-clear');
      this.$autocompleteWrap = $('<ul class="mdb-autocomplete-wrap"></ul>');
      this.init();
    }

    init() {

      this.setData();
      this.inputFocus();
      this.inputBlur();
      this.inputKeyupData();
      this.inputLiClick();
      this.clearAutocomplete();
    }

    assignOptions(options) {

      return $.extend({}, this.defaults, options);
    }

    setData() {

      if (Object.keys(this.options.data).length) {
        this.$autocompleteWrap.insertAfter(this.$input);
      }
    }

    inputFocus() {

      this.$input.on('focus', () => {

        this.$input.css('border-bottom', this.options.inputFocus);
        this.$input.css('box-shadow', this.options.inputFocusShadow);
      });
    }

    inputBlur() {

      this.$input.on('blur', () => {

        this.$input.css('border-bottom', this.options.inputBlur);
        this.$input.css('box-shadow', this.options.inputBlurShadow);
      });
    }

    inputKeyupData() {

      this.$input.on('keyup', e => {

        if (e.which === enterCharCode) {
          if (!this.options.data.includes(this.$input.val())) {
            this.options.data.push(this.$input.val());
          }
          this.$autocompleteWrap.find('.selected').trigger('click');
          this.$autocompleteWrap.empty();
          this.inputBlur();
          count = -1;
          nextScrollHeight = -45;
          return count;
        }

        const $inputValue = this.$input.val();

        this.$autocompleteWrap.empty();

        if ($inputValue.length) {

          for (const item in this.options.data) {

            if (this.options.data[item].toLowerCase().indexOf($inputValue.toLowerCase()) !== -1) {

              const option = $(`<li>${this.options.data[item]}</li>`);

              this.$autocompleteWrap.append(option);
            }
          }

          const $ulList = this.$autocompleteWrap;
          const $ulItems = this.$autocompleteWrap.find('li');
          const nextItemHeight = $ulItems.eq(count).outerHeight();
          const previousItemHeight = $ulItems.eq(count - 1).outerHeight();

          if (e.which === arrowDownCharCode) {
            if (count > $ulItems.length - 2) {

              count = -1;
              $ulItems.scrollTop(0);
              nextScrollHeight = -45;

              return
            } else {

              count++;

            }

            nextScrollHeight += nextItemHeight;
            $ulList.scrollTop(nextScrollHeight);
            $ulItems.eq(count).addClass('selected');

          } else if (e.which === arrowUpCharCode) {

            if (count < 1) {
              count = $ulItems.length;
              $ulList.scrollTop($ulList.prop('scrollHeight'));
              nextScrollHeight = $ulList.prop('scrollHeight') - nextItemHeight;
            } else {

              count--;

            }
            nextScrollHeight -= previousItemHeight;
            $ulList.scrollTop(nextScrollHeight);
            $ulItems.eq(count).addClass('selected');

          }
          if ($inputValue.length === 0) {

            this.$clearButton.css('visibility', 'hidden');
          } else {

            this.$clearButton.css('visibility', 'visible');
          }

          this.$autocompleteWrap.children().css('color', this.options.dataColor);
        } else {
          this.$clearButton.css('visibility', 'hidden');
        }
      });
    }

    inputLiClick() {

      this.$autocompleteWrap.on('click', 'li', e => {

        e.preventDefault();

        this.$input.val($(e.target).text());
        this.$autocompleteWrap.empty();
      });
    }

    clearAutocomplete() {

      this.$clearButton.on('click', e => {

        count = -1;
        nextScrollHeight = -45;

        e.preventDefault();

        const $this = $(e.currentTarget);

        $this.parent().find('.mdb-autocomplete').val('');
        $this.css('visibility', 'hidden');
        this.$autocompleteWrap.empty();
        $this.parent().find('label').removeClass('active');
      });
    }

    changeSVGcolors() {

      if (this.$input.hasClass('mdb-autocomplete')) {

        this.$input.on('click keyup', e => {

          e.preventDefault();
          $(e.target).parent().find('.mdb-autocomplete-clear').find('svg').css('fill', this.options.closeColor);
        });

        this.$input.on('blur', e => {

          e.preventDefault();
          $(e.target).parent().find('.mdb-autocomplete-clear').find('svg').css('fill', this.options.closeBlurColor);
        });
      }
    }
  }

  $.fn.mdbAutocomplete = function (options) {
    return this.each(function () {
      new mdbAutocomplete($(this), options);
    });
  };

})(jQuery);
