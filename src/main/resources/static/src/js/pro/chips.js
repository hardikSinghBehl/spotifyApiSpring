jQuery(($) => {

  $(document).on('click', '.chip .close', function () {

    const $this = $(this);

    if ($this.closest('.chips').data('initialized')) {
      return;
    }

    $this.closest('.chip').remove();
  });

  class MaterialChips {

    constructor($chipsWrapper, options = {}) {

      this.$chipsWrapper = $chipsWrapper;
      this.options = typeof options === 'string' ? options : {
        data: this.fallback().or(options.data).or([]).value(), // @type { tag: string, image?: string, id?: number }[]
        dataChip: this.fallback().or(options.dataChip).or([]).value(), // autocomplete data; @type string[]
        placeholder: this.fallback().or($chipsWrapper.attr('data-placeholder')).or(options.placeholder).or('').value(),
        secondaryPlaceholder: this.fallback().or($chipsWrapper.attr('data-secondary-placeholder')).or(options.secondaryPlaceholder).or('').value(),
        sortAutocompleteData: this.fallback().or($chipsWrapper.attr('data-sort-autocomplete-data')).or(options.sortAutocompleteData).or(true).value(),
        autocompleteDataCompareFn: this.fallback().or(options.autocompleteDataCompareFn).or(undefined).value()
      };

      this.$autocompleteList = $('<ul class="chip-ul z-depth-1" tabindex="0"></ul>');

      this.keyCodes = {
        backspace: 8,
        enter: 13,
        arrowLeft: 37,
        arrowRight: 39,
        delete: 46,
        comma: 188
      };
    }

    get isPublicInterfaceCall() {

      return typeof this.options === 'string';
    }

    get isInitialized() {

      return this.$chipsWrapper.data('initialized');
    }

    getSelectedChip() {

      return this.$chipsWrapper.find('.chip.selected');
    }

    returnPublicInterface() {

      if (this.options === 'data') {
        return this.$chipsWrapper.data('chips');
      }

      if (this.options === 'options') {
        return this.$chipsWrapper.data('options');
      }

      return this.$chipsWrapper;
    }

    init() {

      if (this.isPublicInterfaceCall) {
        return;
      }

      this.assignOptions();

      if (this.isInitialized) {
        return;
      }

      this.$chipsWrapper.data({
        chips: this.options.data.slice(),
        index: this.$chipsWrapper.index(),
        initialized: true
      });
      this.$chipsWrapper.attr('tabindex', 0);

      if (!this.$chipsWrapper.hasClass('.chips')) {
        this.$chipsWrapper.addClass('chips');
      }

      this.renderChips();

      this.bindEvents();
    }

    assignOptions() {

      if (!Array.isArray(this.options.data)) {

        this.options.data = [];
      }

      this.$chipsWrapper.data('options', Object.assign({}, this.options));
    }

    bindEvents() {

      this.bindChipsWrapperClick();
      this.bindChipsWrapperBlur();
      this.bindSingleChipClick();
      this.bindChipsWrapperKeydown();
      this.bindChipsInputClick();
      this.bindChipsInputFocusout();
      this.bindChipsInputKeydown();
      this.bindDeleteButtonClick();
      this.bindAutocompleteInputKeyup();
      this.bindAutocompleteOptionClick();
    }

    bindChipsWrapperClick() {

      this.$chipsWrapper.on('click', (e) => $(e.target).find('input').focus().addClass('active'));
    }

    bindChipsWrapperBlur() {

      this.$chipsWrapper.on('blur', (e) => {

        setTimeout(() => this.$autocompleteList.removeClass('active').hide(), 100);
        $(e.target).removeClass('active');
        this.getSelectedChip().removeClass('selected');
      });
    }

    bindSingleChipClick() {

      this.$chipsWrapper.on('click', '.chip', (e) => {

        const $this = $(e.target);

        this.$chipsWrapper.find('.chip.selected').not($this).removeClass('selected');
        $this.toggleClass('selected');
      });
    }

    bindChipsWrapperKeydown() {

      this.$chipsWrapper.on('keydown', (e) => {

        const backspacePressed = e.which === this.keyCodes.backspace;
        const deletePressed = e.which === this.keyCodes.delete;
        const leftArrowPressed = e.which === this.keyCodes.arrowLeft;
        const rightArrowPressed = e.which === this.keyCodes.arrowRight;

        if ((backspacePressed || deletePressed) && this.getSelectedChip().length) {

          e.preventDefault();

          const nextIndex = this.deleteSelectedChip();
          this.selectChip(nextIndex);
        } else if (leftArrowPressed) {

          this.selectLeftChip();
        } else if (rightArrowPressed) {

          this.selectRightChip();
        }
      });
    }

    bindChipsInputClick() {

      const $chipsInput = this.$chipsWrapper.find('input');
      $chipsInput.on('click', (e) => {

        const $target = $(e.target);
        $target.addClass('active');

        this.$chipsWrapper.addClass('focus');
        this.$chipsWrapper.find('.chip').removeClass('selected');
      });
    }

    bindChipsInputFocusout() {

      this.$chipsWrapper.on('focusout', 'input', () => this.$chipsWrapper.removeClass('focus'));
    }

    bindChipsInputKeydown() {

      this.$chipsWrapper.on('keydown', 'input', (e) => {

        const $chipsInput = $(e.target);

        const enterPressed = e.which === this.keyCodes.enter;
        const commaPressed = e.which === this.keyCodes.comma;
        const backspacePressed = e.which === this.keyCodes.backspace;

        if ((enterPressed || commaPressed) && !this.$autocompleteList.find('li').hasClass('selected')) {

          e.preventDefault();

          this.addChip({
            tag: $chipsInput.val()
          });

          $chipsInput.val('');

          return;
        }

        const isInputEmpty = $chipsInput.val() === '';

        if (isInputEmpty && backspacePressed && !this.$chipsWrapper.find('.chip').hasClass('selected')) {

          const lastChipIndex = this.$chipsWrapper.find('.chip-position-wrapper .chip').last().index();
          this.deleteChip(lastChipIndex);
        }
      });
    }

    bindDeleteButtonClick() {

      this.$chipsWrapper.on('click', '.chip i.close', (e) => {

        const $deleteButton = $(e.target);
        const chipIndex = $deleteButton.closest('.chip').index();

        this.deleteChip(chipIndex);
        this.$chipsWrapper.find('input').focus();
      });
    }

    bindAutocompleteInputKeyup() {

      const $input = this.$chipsWrapper.find('.chip-position-wrapper').find('input');
      $input.on('keyup', (e) => {

        const $inputValue = $input.val();

        this.$autocompleteList.empty();

        if ($inputValue.length) {

          this.options.dataChip.forEach((item) => {

            if (item.toLowerCase().includes($inputValue.toLowerCase())) {

              this.$chipsWrapper.find('.chip-position-wrapper').append(this.$autocompleteList.append($(`<li>${item}</li>`)));
            }
          });

          this.$autocompleteList.addClass('active').show();
        } else {

          this.$autocompleteList.removeClass('active').hide();
        }

        const enterPressed = e.which === this.keyCodes.enter;
        const commaPressed = e.which === this.keyCodes.comma;
        const lastChipText = this.$chipsWrapper.find('.chip-position-wrapper .chip').last().text();

        if ((enterPressed || commaPressed) && !this.options.dataChip.includes(lastChipText)) {

          this.options.dataChip.push(lastChipText);

          if (this.options.sortAutocompleteData) {

            this.options.dataChip.sort(this.options.autocompleteDataCompareFn);
          }
        } else if (enterPressed || commaPressed) {

          this.$autocompleteList.remove();
        }
      });
    }

    bindAutocompleteOptionClick() {

      this.$chipsWrapper.on('click', 'li', (e) => {

        e.preventDefault();

        const $li = $(e.target);
        this.addChip({
          tag: $li.text()
        });

        this.$chipsWrapper.find('.chip-position-wrapper').find('input').val('');
        this.$autocompleteList.remove();
      });
    }

    deleteSelectedChip() {

      const $selectedChip = this.getSelectedChip();
      const siblingsLength = $selectedChip.siblings('.chip').length;
      const chipIndex = $selectedChip.index();

      this.deleteChip(chipIndex);

      let selectIndex = -1;

      if (chipIndex < siblingsLength - 1) {
        selectIndex = chipIndex;
      } else if (chipIndex === siblingsLength || chipIndex === siblingsLength - 1) {
        selectIndex = siblingsLength - 1;
      }

      if (!siblingsLength) {

        this.$chipsWrapper.find('input').focus();
      }

      return selectIndex;
    }

    selectLeftChip() {

      this.selectLeftRightChip(true);
    }

    selectRightChip() {

      this.selectLeftRightChip(false);
    }

    selectLeftRightChip(left) {

      const $selectedChip = this.getSelectedChip();
      const currentIndex = $selectedChip.index();
      const siblingsLength = $selectedChip.siblings('.chip').length;
      let chipIndex = left ? currentIndex - 1 : currentIndex + 1;

      if (left && chipIndex < 0) {

        chipIndex = this.$chipsWrapper.find('.chip').length - 1;
      } else if (!left && chipIndex > siblingsLength) {

        this.$chipsWrapper.find('input').focus();
        return;
      }

      this.$chipsWrapper.find('.chip').removeClass('selected');
      this.selectChip(chipIndex);
    }

    renderChips() {

      let html = '';

      this.$chipsWrapper.data('chips').forEach((elem) => {

        html += this.getSingleChipTemplate(elem);
      });

      if (this.$chipsWrapper.hasClass('chips-autocomplete')) {

        html += '<span class="chip-position-wrapper position-relative"><input class="input" placeholder=""></span>';
      } else {

        html += '<input class="input" placeholder="">';
      }

      this.$chipsWrapper.html(html);

      this.setPlaceholder();
    }

    getSingleChipTemplate(chip) {

      if (!chip.tag) {
        return '';
      }

      let html = `<div class="chip">${chip.tag}`;

      if (chip.image) {
        html += ` <img src="${chip.image}" /> `;
      }

      html += '<i class="close fas fa-times"></i>';
      html += '</div>';

      return html;
    }

    setPlaceholder() {

      this.$chipsWrapper.find('input').prop('placeholder', this.options.data.length ? this.options.placeholder : this.options.secondaryPlaceholder);
    }

    addChip(chip) {

      if (!this.isValid(chip)) {
        return;
      }

      const $newChip = $(this.getSingleChipTemplate(chip));

      this.$chipsWrapper.data('chips').push(chip);
      this.options.data.push(chip);

      if (this.$chipsWrapper.hasClass('chips-autocomplete') && this.$chipsWrapper.find('.chip').length > 0) {

        $newChip.insertAfter(this.$chipsWrapper.find('.chip').last());
      } else {

        $newChip.insertBefore(this.$chipsWrapper.find('input'));
      }

      this.$chipsWrapper.trigger('chip.add', chip);

      this.setPlaceholder();
    }

    isValid(chip) {

      return chip.tag !== '' && !this.options.data.some((c) => c.tag === chip.tag);
    }

    deleteChip(chipIndex) {

      const chip = this.$chipsWrapper.data('chips')[chipIndex];

      this.$chipsWrapper.find('.chip').eq(chipIndex).remove();

      this.$chipsWrapper.data('chips').splice(chipIndex, 1);
      this.options.data.splice(chipIndex, 1);

      this.$chipsWrapper.trigger('chip.delete', chip);

      this.setPlaceholder();
    }

    selectChip(chipIndex) {

      const $chip = this.$chipsWrapper.find('.chip').eq(chipIndex);
      if ($chip && !$chip.hasClass('selected')) {

        $chip.addClass('selected');
        this.$chipsWrapper.trigger('chip.select', this.$chipsWrapper.data('chips')[chipIndex]);
      }
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

  $.fn.materialChip = function (options) {

    if (this.length > 1) {

      const instances = [];

      this.each(function () {

        const materialChips = new MaterialChips($(this), options);
        materialChips.init();

        instances.push(materialChips.returnPublicInterface());
      });

      return instances;
    }

    const materialChips = new MaterialChips($(this), options);
    materialChips.init();

    return materialChips.returnPublicInterface();
  };
});
