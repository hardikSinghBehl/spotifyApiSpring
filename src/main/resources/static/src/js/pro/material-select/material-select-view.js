import MaterialSelectViewRenderer from './material-select-view-renderer'

export default class MaterialSelectView {

  // eslint-disable-next-line object-curly-newline
  constructor($nativeSelect, { options, properties: { id } }) {

    this.properties = {
      id,
      isMultiple: Boolean($nativeSelect.attr('multiple')),
      isSearchable: Boolean($nativeSelect.attr('searchable')),
      isRequired: Boolean($nativeSelect.attr('required')),
      isEditable: Boolean($nativeSelect.attr('editable'))
    };

    this.options = this._copyOptions(options);

    this.$nativeSelect = $nativeSelect;
    this.$selectWrapper = $('<div class="select-wrapper"></div>');
    this.$materialOptionsList = $(`<ul id="select-options-${this.properties.id}" class="dropdown-content select-dropdown w-100 ${this.properties.isMultiple ? 'multiple-select-dropdown' : ''}"></ul>`);
    this.$materialSelectInitialOption = $nativeSelect.find('option:selected').text() || $nativeSelect.find('option:first').text() || '';
    this.$nativeSelectChildren = this.$nativeSelect.children('option, optgroup');
    this.$materialSelect = $(`<input type="text" class="${this.options.defaultMaterialInput ? 'browser-default custom-select multi-bs-select select-dropdown form-control' : 'select-dropdown form-control'}" ${!this.options.validate && 'readonly="true"'} required="${this.options.validate ? 'true' : 'false'}" ${this.$nativeSelect.is(' :disabled') ? 'disabled' : ''} data-activates="select-options-${this.properties.id}" value=""/>`);
    this.$dropdownIcon = this.options.defaultMaterialInput ? '' : $('<span class="caret">&#9660;</span>');
    this.$searchInput = null;
    this.$noSearchResultsInfo = $(`<li><span><i>${this.options.labels.noSearchResults}</i></span></li>`);
    this.$toggleAll = $(`<li class="select-toggle-all"><span><input type="checkbox" class="form-check-input"><label>${this.options.labels.selectAll}</label></span></li>`);
    this.$addOptionBtn = $('<i class="select-add-option fas fa-plus"></i>');
    this.$mainLabel = this._jQueryFallback(this.$nativeSelect.next('label.mdb-main-label'), $(`label[for='${this.properties.id}']`));
    this.$customTemplateParts = this._jQueryFallback(this.$nativeSelect.nextUntil('select', '.mdb-select-template-part'), $(`[data-mdb-select-template-part-for='${this.properties.id}']`));
    this.$btnSave = this.$nativeSelect.nextUntil('select', '.btn-save'); // @Depreciated
    this.$btnReset = $('<span class="reset-select-btn">&times;</span>');

    this.$validFeedback = $(`<div class="valid-feedback">${this.options.labels.validFeedback}</div>`);
    this.$invalidFeedback = $(`<div class="invalid-feedback">${this.options.labels.invalidFeedback}</div>`);

    this.keyCodes = {
      tab: 9,
      enter: 13,
      shift: 16,
      alt: 18,
      esc: 27,
      space: 32,
      end: 35,
      home: 36,
      arrowUp: 38,
      arrowDown: 40
    };

    // eslint-disable-next-line no-undef
    this.renderer = new MaterialSelectViewRenderer(this);
    this.dropdown = null;
  }

  static get isMobileDevice() {

    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  get isMultiple() {
    return this.properties.isMultiple;
  }

  get isSearchable() {
    return this.properties.isSearchable;
  }

  get isRequired() {
    return this.properties.isRequired;
  }

  get isEditable() {
    return this.properties.isEditable;
  }

  get isDisabled() {
    return this.$nativeSelect.is(':disabled');
  }

  destroy() {

    this.renderer.destroy();
  }

  render() {

    this.renderer.render();
  }

  selectPreselectedOptions(handler) {

    if (this.isMultiple) {

      this.$nativeSelect.find('option:selected:not(:disabled)').each((i, element) => {

        const index = element.index;
        this.$materialOptionsList.find('li:not(.optgroup):not(.select-toggle-all)').eq(index).addClass('selected active').find(':checkbox').prop('checked', true);
        handler(index);
      });
    } else {

      const $preselectedOption = this.$nativeSelect.find('option:selected').first();
      const indexOfPreselectedOption = this.$nativeSelect.find('option').index($preselectedOption.get(0));
      if ($preselectedOption.get(0) && $preselectedOption.attr('disabled') !== 'disabled') {
        handler(indexOfPreselectedOption);
      }
    }
  }

  bindResetButtonClick(handler) {

    this.$btnReset.on('click', (e) => {

      e.preventDefault();

      if (!this.$nativeSelect.find('option[value=""][selected][disabled][data-mdb-novalue]').length) {

        this._toggleResetButton(true);

        this.$materialSelect.val(this.isMultiple ? [] : '');
        this.$materialSelect.trigger('close');
        this.$mainLabel.removeClass('active');
        this.$materialOptionsList.find('li.active, li.selected').removeClass('active').removeClass('selected');
        this.$materialOptionsList.find('li[aria-selected="true"]').attr('aria-selected', 'false');
        this.$materialOptionsList.find('input[type="checkbox"]').prop('checked', false);

        handler();
      }
    });
  }

  bindAddNewOptionClick() {

    this.$addOptionBtn.on('click', this.renderer.addNewOption.bind(this.renderer));
  }

  bindMaterialSelectFocus() {

    this.$materialSelect.on('focus', (e) => {
      
      const $this = $(e.target);
      
      $this.parent().addClass('active');

      if ($('ul.select-dropdown').not(this.$materialOptionsList.get(0)).is(':visible')) {

        $('input.select-dropdown').trigger('close');
      }

      this.$mainLabel.addClass('active');

      if (!this.$materialOptionsList.is(':visible')) {

        const label = $this.val();
        const $selectedOption = this.$materialOptionsList.find('li').filter(function () {

          return $(this).text().toLowerCase() === label.toLowerCase();
        }).get(0);

        this._selectSingleOption($selectedOption);
      }

      if (!this.isMultiple) {

        this.$mainLabel.addClass('active');
      }
    });
  }

  bindMaterialSelectClick() {

    this.$materialSelect.on('mousedown', (e) => {

      if (e.which === 3) {
        e.preventDefault();
      }
    });

    this.$materialSelect.on('click', (e) => {

      e.stopPropagation();

      this.$mainLabel.addClass('active');

      this._updateDropdownScrollTop();
    });
  }

  bindMaterialSelectBlur() {

    this.$materialSelect.on('blur', (e) => {

      const $this = $(e.target);

      $this.parent().removeClass('active');

      if (!this.isMultiple && !this.isSearchable) {

        $this.trigger('close');
      }

      this.$materialOptionsList.find('li.selected').removeClass('selected');
    });
  }

  bindMaterialOptionsListTouchstart() {

    this.$materialOptionsList.on('touchstart', (e) => e.stopPropagation());
  }

  bindMaterialSelectKeydown() {

    // eslint-disable-next-line complexity
    this.$materialSelect.on('keydown', (e) => {

      const $this = $(e.target);

      const isTab = e.which === this.keyCodes.tab;

      const isArrowUp = e.which === this.keyCodes.arrowUp;
      const isArrowDown = e.which === this.keyCodes.arrowDown;
      const isEnter = e.which === this.keyCodes.enter;
      const isEsc = e.which === this.keyCodes.esc;
      const isAltWithArrowDown = isArrowDown && e.altKey;
      const isAltWithArrowUp = isArrowUp && e.altKey;
      const isHome = e.which === this.keyCodes.home;
      const isEnd = e.which === this.keyCodes.end;
      const isSpace = e.which === this.keyCodes.space;

      const isDropdownExpanded = this.$materialOptionsList.is(':visible');

      switch (true) {
        case isTab:
          return this._handleTabKey($this);

        case !isDropdownExpanded && (isEnter || isAltWithArrowDown):
        case this.isMultiple && !isDropdownExpanded && (isArrowDown || isArrowUp):
          $this.trigger('open');
          return this._updateDropdownScrollTop();

        case isDropdownExpanded && (isEsc || isAltWithArrowUp):
          return $this.trigger('close');

        case !isDropdownExpanded && (isArrowDown || isArrowUp):
          return this._handleClosedArrowUpDownKey(e.which);

        case isDropdownExpanded && (isArrowDown || isArrowUp):
          return this._handleArrowUpDownKey(e.which);

        case isDropdownExpanded && isHome:
          return this._handleHomeKey();

        case isDropdownExpanded && isEnd:
          return this._handleEndKey();

        case isDropdownExpanded && (isEnter || isSpace):
          return this._handleEnterKey($this);

        default:
          return this._handleLetterKey(e);
      }
    });
  }

  bindMaterialSelectDropdownToggle() {

    this.$materialSelect.on('open', () => this.$materialSelect.attr('aria-expanded', 'true'));
    this.$materialSelect.on('close', () => this.$materialSelect.attr('aria-expanded', 'false'));
  }

  bindToggleAllClick(handler) {

    this.$toggleAll.on('click', (e) => {

      const checkbox = $(this.$toggleAll).find('input[type="checkbox"]').first();
      const currentState = Boolean($(checkbox).prop('checked'));
      const isToggleChecked = !currentState;

      $(checkbox).prop('checked', !currentState);

      this.$materialOptionsList.find('li:not(.optgroup):not(.select-toggle-all)').each((materialOptionIndex, materialOption) => {

        const $materialOption = $(materialOption);
        const $optionCheckbox = $materialOption.find('input[type="checkbox"]');

        $materialOption.attr('aria-selected', isToggleChecked);

        if (isToggleChecked && $optionCheckbox.is(':checked') || !isToggleChecked && !$optionCheckbox.is(':checked') || $(materialOption).is(':hidden') || $(materialOption).is('.disabled')) {

          return;
        }

        $optionCheckbox.prop('checked', isToggleChecked);
        this.$nativeSelect.find('option').eq(materialOptionIndex).prop('selected', isToggleChecked);

        $materialOption.toggleClass('active');
        this._selectOption(materialOption);
        handler(materialOptionIndex);
      });

      this.$nativeSelect.data('stop-refresh', true);
      this._triggerChangeOnNativeSelect();
      this.$nativeSelect.removeData('stop-refresh');
      e.stopPropagation();
    });
  }

  bindMaterialOptionMousedown() {

    this.$materialOptionsList.on('mousedown', (e) => {

      const option = e.target;

      const inModal = $('.modal-content').find(this.$materialOptionsList).length;
      if (inModal && option.scrollHeight > option.offsetHeight) {

        e.preventDefault();
      }
    });
  }

  bindMaterialOptionClick(handler) {

    this.$materialOptionsList.find('li:not(.optgroup)').not(this.$toggleAll).each((materialOptionIndex, materialOption) => {
      $(materialOption).on('click', (e) => {

        e.stopPropagation();

        this._toggleResetButton(false);

        const $this = $(materialOption);

        if ($this.hasClass('disabled') || $this.hasClass('optgroup')) {

          return;
        }

        let selected = true;

        if (this.isMultiple) {

          $this.find('input[type="checkbox"]').prop('checked', (index, oldPropertyValue) => !oldPropertyValue);

          const hasOptgroup = Boolean(this.$nativeSelect.find('optgroup').length);
          const thisIndex = this._isToggleAllPresent() ? $this.index() - 1 : $this.index();

          /* eslint-disable max-statements-per-line */
          switch (true) {
            case this.isSearchable && hasOptgroup: selected = handler(thisIndex - $this.prevAll('.optgroup').length - 1); break;
            case this.isSearchable: selected = handler(thisIndex - 1); break;
            case hasOptgroup: selected = handler(thisIndex - $this.prevAll('.optgroup').length); break;
            default: selected = handler(thisIndex); break;
          }
          /* eslint-enable max-statements-per-line */

          if (this._isToggleAllPresent()) {

            this._updateToggleAllOption();
          }

          this.$materialSelect.trigger('focus');
        } else {
          
          this.$materialOptionsList.find('li').removeClass('active').attr('aria-selected', 'false');
          const $selectedOption = $this.children().last()[0].childNodes[0]
          this.$materialSelect.val($($selectedOption).text().replace(/  +/g, ' ').trim());
          this.$materialSelect.trigger('close');
        }
        
        $this.toggleClass('active');
        const ariaSelected = $this.attr('aria-selected');
        $this.attr('aria-selected', ariaSelected === 'true' ? 'false' : 'true');
        this._selectSingleOption($this);
        this.$nativeSelect.data('stop-refresh', true);
        const selectedOptionIndex = this.$nativeSelect.attr('data-placeholder') ? materialOptionIndex + 1 : materialOptionIndex;
        this.$nativeSelect.find('option').eq(selectedOptionIndex).prop('selected', selected);
        this.$nativeSelect.removeData('stop-refresh');
        this._triggerChangeOnNativeSelect();
        
        if (this.$materialSelect.val()) {

          this.$mainLabel.addClass('active');
        }

        if ($this.hasClass('li-added')) {

          this.renderer.buildSingleOption($this, '');
        }
      });
    });
  }

  bindSingleMaterialOptionClick() {

    this.$materialOptionsList.find('li').on('click', () => {

      this.$materialSelect.trigger('close');
    });
  }

  bindSearchInputKeyup() {

    this.$searchInput.find('.search').on('keyup', (e) => {

      const $this = $(e.target);

      const isTab = e.which === this.keyCodes.tab;
      const isEsc = e.which === this.keyCodes.esc;
      const isEnter = e.which === this.keyCodes.enter;
      const isEnterWithShift = isEnter && e.shiftKey;
      const isArrowUp = e.which === this.keyCodes.arrowUp;
      const isArrowDown = e.which === this.keyCodes.arrowDown;

      if (isArrowDown || isTab || isEsc || isArrowUp) {

        this.$materialSelect.focus();
        this._handleArrowUpDownKey(e.which);
        return;
      }

      const $ul = $this.closest('ul');
      const searchValue = $this.val();
      const $options = $ul.find('li span.filtrable');

      let isOptionInList = false;

      $options.each(function () {

        const $option = $(this);
        if (typeof this.outerHTML === 'string') {

          const liValue = this.textContent.toLowerCase();

          if (liValue.includes(searchValue.toLowerCase())) {

            $option.show().parent().show();
          } else {
            $option.hide().parent().hide();
          }

          if (liValue.trim() === searchValue.toLowerCase()) {
            isOptionInList = true;
          }
        }
      });

      if (isEnter) {
        if (this.isEditable && !isOptionInList) {
          this.renderer.addNewOption();
          return;
        }
        if (isEnterWithShift) {
          this._handleEnterWithShiftKey($this);
        }
        this.$materialSelect.trigger('open');
        return;
      }

      this.$addOptionBtn[searchValue && this.isEditable && !isOptionInList ? 'show' : 'hide']();

      const anyOptionMatch = $options.filter((_, e) => $(e).is(':visible') && !$(e).parent().hasClass('disabled')).length !== 0;
      if (!anyOptionMatch) {

        this.$toggleAll.hide();
        this.$materialOptionsList.append(this.$noSearchResultsInfo);
      } else {

        this.$toggleAll.show();
        this.$materialOptionsList.find(this.$noSearchResultsInfo).remove();
        this._updateToggleAllOption();
      }

      this.dropdown.updatePosition(this.$materialSelect, this.$materialOptionsList);
    });
  }

  bindHtmlClick() {

    $('html').on('click', (e) => {

      if (!$(e.target).closest(`#select-options-${this.properties.id}`).length && !$(e.target).hasClass('mdb-select') && $(`#select-options-${this.properties.id}`).hasClass('active')) {

        this.$materialSelect.trigger('close');

        if (!this.$materialSelect.val() && !this.options.placeholder) {

          this.$mainLabel.removeClass('active');
        }
      }

      if (this.isSearchable && this.$searchInput !== null && this.$materialOptionsList.hasClass('active')) {

        this.$materialOptionsList.find('.search-wrap input.search').focus();
      }
    });
  }

  bindMobileDevicesMousedown() {

    $('select').siblings('input.select-dropdown', 'input.multi-bs-select').on('mousedown', (e) => {
      if (MaterialSelectView.isMobileDevice && (e.clientX >= e.target.clientWidth || e.clientY >= e.target.clientHeight)) {
        e.preventDefault();
      }
    });
  }

  bindSaveBtnClick() { // @Depreciated

    this.$btnSave.on('click', () => {

      this.$materialSelect.trigger('close');
    });
  }

  _toggleResetButton(hide) {

    const previousValue = this.$nativeSelect.data('stop-refresh');
    this.$nativeSelect.attr('data-stop-refresh', 'true');

    if (hide) {

      this.$nativeSelect.prepend('<option value="" selected disabled data-mdb-novalue></option>');
    } else {

      this.$nativeSelect.find('option[data-mdb-novalue]').remove();
    }

    this.$nativeSelect.attr('data-stop-refresh', previousValue);
    this.$btnReset[hide ? 'hide' : 'show']();
  }

  _isToggleAllPresent() {

    return this.$materialOptionsList.find(this.$toggleAll).length;
  }

  _updateToggleAllOption() {

    const $allOptionsButToggleAll = this.$materialOptionsList.find('li').not('.select-toggle-all, .disabled, :hidden').find('[type=checkbox]');
    const $checkedOptionsButToggleAll = $allOptionsButToggleAll.filter(':checked');
    const isToggleAllChecked = this.$toggleAll.find('[type=checkbox]').is(':checked');

    if ($checkedOptionsButToggleAll.length === $allOptionsButToggleAll.length && !isToggleAllChecked) {

      this.$toggleAll.find('[type=checkbox]').prop('checked', true);
    } else if ($checkedOptionsButToggleAll.length < $allOptionsButToggleAll.length && isToggleAllChecked) {

      this.$toggleAll.find('[type=checkbox]').prop('checked', false);
    }
  }

  _handleTabKey($materialSelect) {

    this._handleEscKey($materialSelect);
  }

  _handleEnterWithShiftKey($materialSelect) {

    if (!this.isMultiple) {

      this._handleEnterKey($materialSelect);
    } else {

      this.$toggleAll.trigger('click');
    }
  }

  _handleEnterKey($materialSelect) {

    const $activeOption = this.$materialOptionsList.find('li.selected:not(.disabled)');

    $activeOption.trigger('click').addClass('active');

    this._removeKeyboardActiveClass();

    if (!this.isMultiple) {

      $materialSelect.trigger('close');
    }
  }

  _handleArrowUpDownKey(keyCode) {

    // eslint-disable-next-line object-curly-newline
    const { $matchedMaterialOption, $activeOption } = this._getArrowMatchedActiveOptions(keyCode, false);

    this._selectSingleOption($matchedMaterialOption);
    this._removeKeyboardActiveClass();

    if (!$matchedMaterialOption.find('input').is(':checked')) {

      $matchedMaterialOption.removeClass(this.options.keyboardActiveClass);
    }

    if (!$activeOption.hasClass('selected') && !$activeOption.find('input').is(':checked') && this.isMultiple) {

      $activeOption.removeClass('active', this.options.keyboardActiveClass);
    }

    $matchedMaterialOption.addClass(this.options.keyboardActiveClass);

    if ($matchedMaterialOption.position()) {
      this.$materialOptionsList.scrollTop(this.$materialOptionsList.scrollTop() + $matchedMaterialOption.position().top);
    }
  }

  _handleClosedArrowUpDownKey(keyCode) {

    // eslint-disable-next-line object-curly-newline
    const { $matchedMaterialOption } = this._getArrowMatchedActiveOptions(keyCode, true);

    $matchedMaterialOption.trigger('click').addClass('active');

    this._updateDropdownScrollTop();
    this._selectSingleOption($matchedMaterialOption);
  }

  _getArrowMatchedActiveOptions(keyCode, closedDropdown) {

    const visible = closedDropdown ? '' : ':visible';
    const $availableOptions = this.$materialOptionsList.find(`li${visible}`).not('.disabled, .select-toggle-all');

    const $firstOption = $availableOptions.first();
    const $lastOption = $availableOptions.last();
    const anySelected = this.$materialOptionsList.find('li.selected').length > 0;

    let $matchedMaterialOption = null;
    let $activeOption = null;

    const isArrowUp = keyCode === this.keyCodes.arrowUp;
    if (isArrowUp) {

      const $currentOption = anySelected ? this.$materialOptionsList.find('li.selected').first() : $lastOption;
      let $prevOption = $currentOption.prev(`li${visible}:not(.disabled, .select-toggle-all)`);
      $activeOption = $prevOption;

      $availableOptions.each((key, el) => {
        if ($(el).hasClass(this.options.keyboardActiveClass)) {
          $prevOption = $availableOptions.eq(key - 1);
          $activeOption = $availableOptions.eq(key);
        }
      });

      $matchedMaterialOption = $currentOption.is($firstOption) || !anySelected ? $currentOption : $prevOption;
    } else {

      const $currentOption = anySelected ? this.$materialOptionsList.find('li.selected').first() : $firstOption;
      let $nextOption = $currentOption.next(`li${visible}:not(.disabled, .select-toggle-all)`);
      $activeOption = $nextOption;

      $availableOptions.each((key, el) => {
        if ($(el).hasClass(this.options.keyboardActiveClass)) {
          $nextOption = $availableOptions.eq(key + 1);
          $activeOption = $availableOptions.eq(key);
        }
      });

      $matchedMaterialOption = $currentOption.is($lastOption) || !anySelected ? $currentOption : $nextOption;
    }

    return {
      $matchedMaterialOption,
      $activeOption
    };
  }

  _handleHomeKey() {

    this._selectBoundaryOption('first');
  }

  _handleEndKey() {

    this._selectBoundaryOption('last');
  }

  _selectBoundaryOption(firstOrLast = '') {

    const $boundaryOption = this.$materialOptionsList.find('li:visible').not('.disabled, .select-toggle-all')[firstOrLast]();

    this._selectSingleOption($boundaryOption);

    this._removeKeyboardActiveClass();

    if (!$boundaryOption.find('input').is(':checked')) {

      $boundaryOption.removeClass(this.options.keyboardActiveClass);
    }

    $boundaryOption.addClass(this.options.keyboardActiveClass);

    if ($boundaryOption.position()) {
      this.$materialOptionsList.scrollTop(this.$materialOptionsList.scrollTop() + $boundaryOption.position().top);
    }
  }

  _handleEscKey($materialSelect) {

    this._removeKeyboardActiveClass();
    $materialSelect.trigger('close');
  }

  _handleLetterKey(e) {

    this._removeKeyboardActiveClass();

    if (this.isSearchable) {

      const isLetter = e.which > 46 && e.which < 91;
      const isNumber = e.which > 93 && e.which < 106;
      const isBackspace = e.which === 8;

      if (isLetter || isNumber) {
        this.$searchInput.find('input').val(e.key).focus();
      }
      if (isBackspace) {
        this.$searchInput.find('input').val('').focus();
      }

    } else {

      let filterQueryString = '';
      const letter = String.fromCharCode(e.which).toLowerCase();
      const nonLetters = Object.keys(this.keyCodes).map((key) => this.keyCodes[key]);
      const isLetterSearchable = letter && nonLetters.indexOf(e.which) === -1;

      if (isLetterSearchable) {

        filterQueryString += letter;

        const $matchedMaterialOption = this.$materialOptionsList.find('li').filter((index, element) => $(element).text().toLowerCase().includes(filterQueryString)).first();

        if (!this.isMultiple) {

          this.$materialOptionsList.find('li').removeClass('active');
        }

        $matchedMaterialOption.addClass('active');
        this._selectSingleOption($matchedMaterialOption);
        this._updateDropdownScrollTop();
      }
    }
  }

  _removeKeyboardActiveClass() {

    this.$materialOptionsList.find('li').removeClass(this.options.keyboardActiveClass);
  }

  _triggerChangeOnNativeSelect() {

    const keyboardEvt = new KeyboardEvent('change', {
      bubbles: true,
      cancelable: true
    });
    this.$nativeSelect.get(0).dispatchEvent(keyboardEvt);
  }

  _selectSingleOption(newOption) {

    this.$materialOptionsList.find('li.selected').removeClass('selected');

    this._selectOption(newOption);
  }

  _updateDropdownScrollTop() {

    const $preselected = this.$materialOptionsList.find('li.active').not('.disabled').first();
    if ($preselected.length) {
      this.$materialOptionsList.scrollTo($preselected);
    } else {
      this.$materialOptionsList.scrollTop(0);
    }
  }

  _selectOption(newOption) {

    const option = $(newOption);
    option.addClass('selected');
  }

  _copyOptions(options) {

    return $.extend({}, options);
  }

  _jQueryFallback(...$elements) {

    let $lastElem = null;
    for (let i = 0; i < $elements.length; i++) {

      $lastElem = $elements[i];
      if ($lastElem.length) {
        return $lastElem;
      }
    }

    return $lastElem;
  }
}
