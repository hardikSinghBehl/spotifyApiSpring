import MaterialSelectView from './material-select-view'

jQuery(($) => {

  class MaterialSelect {

    constructor($nativeSelect, options = {}) {

      this.options = {
        destroy: this.fallback().or(options.destroy).or(false).value(),
        validate: this.fallback().or($nativeSelect.attr('data-validate')).or(options.validate).or(false).value(),
        selectId: this.fallback().or($nativeSelect.attr('data-select-id')).or(options.selectId).or(null).value(),
        defaultMaterialInput: this.fallback().or($nativeSelect.attr('data-default-material-input')).or(options.defaultMaterialInput).or(false).value(),
        fasClasses: this.fallback().or($nativeSelect.attr('data-fas-classes')).or(options.fasClasses).or('').value(),
        farClasses: this.fallback().or($nativeSelect.attr('data-far-classes')).or(options.farClasses).or('').value(),
        fabClasses: this.fallback().or($nativeSelect.attr('data-fab-classes')).or(options.fabClasses).or('').value(),
        copyClassesOption: this.fallback().or($nativeSelect.attr('data-copy-classes-option')).or(options.copyClassesOption).or(false).value(),
        labels: {
          selectAll: this.fallback().or($nativeSelect.attr('data-label-select-all')).or((options.labels || {}).selectAll).or('Select all').value(),
          optionsSelected: this.fallback().or($nativeSelect.attr('data-label-options-selected')).or((options.labels || {}).optionsSelected).or('options selected').value(),
          validFeedback: this.fallback().or($nativeSelect.attr('data-label-valid-feedback')).or((options.labels || {}).validFeedback).or('Ok').value(),
          invalidFeedback: this.fallback().or($nativeSelect.attr('data-label-invalid-feedback')).or((options.labels || {}).invalidFeedback).or('Incorrect value').value(),
          noSearchResults: this.fallback().or($nativeSelect.attr('data-label-no-search-results')).or((options.labels || {}).noSearchResults).or('No results').value()
        },
        keyboardActiveClass: this.fallback().or($nativeSelect.attr('data-keyboard-active-class')).or(options.keyboardActiveClass).or('heavy-rain-gradient').value(),
        placeholder: this.fallback().or($nativeSelect.attr('data-placeholder')).or(options.placeholder).or(null).value(),
        visibleOptions: this.fallback().or($nativeSelect.attr('data-visible-options')).or(options.visibleOptions).or(5).value(),
        maxSelectedOptions: this.fallback().or($nativeSelect.attr('data-max-selected-options')).or(options.maxSelectedOptions).or(5).value(),
        showResetButton: this.fallback().or($nativeSelect.attr('data-show-reset-button')).or(options.showResetButton).or(false).value()
      };

      this.uuid = $nativeSelect.attr('id') || this.options.selectId || this._randomUUID();

      // eslint-disable-next-line no-undef
      this.view = new MaterialSelectView(
        $nativeSelect,
        {
          options: this.options,
          properties: {
            id: this.uuid
          }
        }
      );

      this.selectedOptionsIndexes = []; // jQuery indexes; `.eq()` is operating on these

      MaterialSelect.mutationObservers = [];
    }

    get isInitialized() {

      return Boolean(this.view.$nativeSelect.data('select-id')) && this.view.$nativeSelect.hasClass('initialized');
    }

    static clearMutationObservers() {

      MaterialSelect.mutationObservers.forEach((observer) => {

        observer.disconnect();
        observer.customStatus = 'stopped';
      });
    }

    static mdbSelectAutoInit() {

      $('.mdb-select.mdb-select-autoinit').materialSelect();
    }

    init() {

      if (this.options.destroy) {

        this.view.destroy();
        return;
      }

      if (this.isInitialized) {

        this.view.destroy();
      }

      this.view.render();
      this.view.selectPreselectedOptions((optionIndex) => this._toggleSelectedValue(optionIndex));

      this.bindEvents();
    }

    bindEvents() {

      this.bindMutationObserverChange();

      if (this.view.isEditable && this.view.isSearchable) {

        this.view.bindResetButtonClick(() => this._resetSelection());
      }

      this.view.bindAddNewOptionClick();
      this.view.bindMaterialSelectFocus();
      this.view.bindMaterialSelectClick();
      this.view.bindMaterialSelectBlur();
      this.view.bindMaterialOptionsListTouchstart();
      this.view.bindMaterialSelectKeydown();
      this.view.bindMaterialSelectDropdownToggle();
      this.view.bindToggleAllClick((materialOptionIndex) => this._toggleSelectedValue(materialOptionIndex));
      this.view.bindMaterialOptionMousedown();
      this.view.bindMaterialOptionClick((optionIndex) => this._toggleSelectedValue(optionIndex));

      if (!this.view.isMultiple && this.view.isSearchable) {

        this.view.bindSingleMaterialOptionClick();
      }

      if (this.view.isSearchable) {

        this.view.bindSearchInputKeyup();
      }

      this.view.bindHtmlClick();
      this.view.bindMobileDevicesMousedown();
      this.view.bindSaveBtnClick(); // @Depreciated
    }

    bindMutationObserverChange() {

      const config = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      };
      const observer = new MutationObserver(this._onMutationObserverChange.bind(this));
      observer.observe(this.view.$nativeSelect.get(0), config);
      observer.customId = this.uuid;
      observer.customStatus = 'observing';

      MaterialSelect.clearMutationObservers();
      MaterialSelect.mutationObservers.push(observer);
    }

    _onMutationObserverChange(mutationsList) {

      mutationsList.forEach((mutation) => {

        const $select = $(mutation.target).closest('select');
        if ($select.data('stop-refresh') !== true && (mutation.type === 'childList' || mutation.type === 'attributes' && $(mutation.target).is('option'))) {

          MaterialSelect.clearMutationObservers();

          // eslint-disable-next-line object-curly-newline
          $select.materialSelect({ destroy: true });
          $select.materialSelect();
        }
      });
    }

    _resetSelection() {

      this.selectedOptionsIndexes = [];
      this.view.$nativeSelect.find('option').prop('selected', false);
    }

    _toggleSelectedValue(optionIndex) {

      const selectedValueIndex = this.selectedOptionsIndexes.indexOf(optionIndex);
      const isSelected = selectedValueIndex !== -1;

      if (!isSelected) {

        this.selectedOptionsIndexes.push(optionIndex);
      } else {

        this.selectedOptionsIndexes.splice(selectedValueIndex, 1);
      }

      this.view.$nativeSelect.find('option').eq(optionIndex).prop('selected', !isSelected);

      this._setValueToMaterialSelect();

      return !isSelected;
    }

    _setValueToMaterialSelect() {

      let value = '';
      const selectedValuesCount = this.selectedOptionsIndexes.length;

      this.selectedOptionsIndexes.forEach((index) => value += `, ${this.view.$nativeSelect.find('option').eq(index).text().replace(/  +/g, ' ').trim()}`);

      if (this.options.maxSelectedOptions >= 0 && selectedValuesCount > this.options.maxSelectedOptions) {
        value = `${selectedValuesCount} ${this.options.labels.optionsSelected}`;
      } else {
        value = value.substring(2);
      }

      if (value.length === 0) {
        value = this.view.$nativeSelect.find('option:disabled').eq(0).text();
      }

      this.view.$nativeSelect.siblings(`${this.options.defaultMaterialInput ? 'input.multi-bs-select' : 'input.select-dropdown'}`).val(value);
    }

    _randomUUID() {

      let d = new Date().getTime();

      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {

        // eslint-disable-next-line no-bitwise
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        // eslint-disable-next-line no-bitwise
        return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
      });
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

  $.fn.materialSelect = function (options) {

    $(this).not('.browser-default').not('.custom-select').each(function () {

      const materialSelect = new MaterialSelect($(this), options);
      materialSelect.init();
    });
  };

  (function (originalVal) {

    $.fn.val = function (value) {

      if (!arguments.length) {

        return originalVal.call(this);
      }

      if (this.data('stop-refresh') !== true && this.hasClass('mdb-select') && this.hasClass('initialized')) {

        MaterialSelect.clearMutationObservers();

        this.materialSelect({
          destroy: true
        });

        const ret = originalVal.call(this, value);
        this.materialSelect();

        return ret;
      }

      return originalVal.call(this, value);
    };
  }($.fn.val));

  MaterialSelect.mdbSelectAutoInit();
});
