export default class MaterialSelectViewRenderer {

  constructor(view) {

    this.view = view;
  }

  get shouldValidate() {
    return this.view.options.validate;
  }

  get shouldInheritTabindex() {
    return this.view.$nativeSelect.data('inherit-tabindex') !== false;
  }

  get isMultiple() {
    return this.view.isMultiple;
  }

  get isSearchable() {
    return this.view.isSearchable;
  }

  get isRequired() {
    return this.view.isRequired;
  }

  get isEditable() {
    return this.view.isEditable;
  }

  get isDisabled() {
    return this.view.isDisabled;
  }

  get isDefaultMaterialInput() {
    return this.view.options.defaultMaterialInput;
  }

  get isCustomSelect() {
    return this.view.$materialSelect.hasClass('custom-select') && this.view.$materialSelect.hasClass('select-dropdown');
  }

  destroy() {

    const currentUuid = this.view.$nativeSelect.data('select-id');

    this.view.$nativeSelect.data('select-id', null).removeClass('initialized');
    this.view.$nativeSelect.parent().find('span.caret').remove();
    this.view.$nativeSelect.parent().find('input').remove();
    this.view.$nativeSelect.unwrap();

    $(`ul#select-options-${currentUuid}`).remove();
  }

  render() {

    this.setWrapperClasses();
    this.setMaterialSelectInitialValue();

    this.view.$nativeSelect.data('select-id', this.view.properties.id);
    this.view.$nativeSelect.before(this.view.$selectWrapper);

    if (this.view.options.showResetButton) {

      this.appendResetButton();
    }

    this.appendDropdownIcon();
    this.appendMaterialSelect();
    this.appendMaterialOptionsList();
    this.appendNativeSelect();
    this.appendSelectLabel();
    this.appendCustomTemplateParts();

    if (this.shouldValidate) {

      this.appendValidationFeedbackElements();
    }

    if (this.isRequired) {

      this.enableValidation();
    }

    if (!this.isDisabled) {

      this.setMaterialOptionsListMaxHeight();
      this.view.dropdown = this.view.$materialSelect.dropdown({
        hover: false,
        closeOnClick: false,
        resetScroll: false
      });
    }

    if (this.shouldInheritTabindex) {

      this.view.$materialSelect.attr('tabindex', this.view.$nativeSelect.attr('tabindex'));
    }

    if (this.isDefaultMaterialInput) {

      this.view.$mainLabel.css('top', '-7px');
    }

    if (this.isCustomSelect) {

      this.view.$materialSelect.css({
        display: 'inline-block',
        width: '100%',
        height: 'calc(1.5em + .75rem + 2px)',
        padding: '.375rem 1.75rem .375rem .75rem',
        fontSize: '1rem',
        lineHeight: '1.5',
        backgroundColor: '#fff',
        border: '1px solid #ced4da'
      });
    }

    this.addAccessibilityAttributes();
    this.markInitialized();
  }

  setWrapperClasses() {

    if (this.isDefaultMaterialInput) {

      this.view.$selectWrapper
        .addClass(
          this.view.$nativeSelect.attr('class').split(' ').filter((el) => el !== 'md-form').join(' ')
        )
        .css({
          marginTop: '1.5rem',
          marginBottom: '1.5rem'
        });

    } else {
      this.view.$selectWrapper.addClass(this.view.$nativeSelect.attr('class'));
    }
  }

  setMaterialSelectInitialValue() {

    if (!this.view.options.placeholder) {

      const sanitizedLabelHtml = this.view.$materialSelectInitialOption.replace(/"/g, '&quot;').replace(/  +/g, ' ').trim();
      this.view.$materialSelect.val(sanitizedLabelHtml);
    } else {

      this.view.$materialSelect.attr('placeholder', this.view.options.placeholder);
      if (!this.view.$nativeSelect.find('option[value=""][selected][disabled][data-mdb-placeholder]').length) {

        this.view.$nativeSelect.prepend('<option value="" selected disabled data-mdb-placeholder></option>');
      }
    }
  }

  appendDropdownIcon() {

    if (this.isDisabled) {

      this.view.$dropdownIcon.addClass('disabled');
    }

    this.view.$selectWrapper.append(this.view.$dropdownIcon);
  }

  appendResetButton() {

    if (this.isDisabled) {

      this.view.$btnReset.addClass('disabled');
    }

    if (this.view.$nativeSelect.get(0).selectedIndex === -1) {

      this.view.$btnReset.hide();
    }

    this.view.$selectWrapper.append(this.view.$btnReset);
  }

  appendMaterialSelect() {

    this.view.$selectWrapper.append(this.view.$materialSelect);
  }

  appendMaterialOptionsList() {

    if (this.isSearchable) {

      this.appendSearchInputOption();
    }

    if (this.isEditable && this.isSearchable) {

      this.appendAddOptionBtn();
    }

    this.buildMaterialOptions();

    if (this.isMultiple) {

      this.appendToggleAllCheckbox();
    }

    this.view.$selectWrapper.append(this.view.$materialOptionsList);
  }

  appendNativeSelect() {

    this.view.$nativeSelect.appendTo(this.view.$selectWrapper);
  }

  appendSelectLabel() {

    if (this.view.$materialSelect.val() || this.view.options.placeholder) {

      this.view.$mainLabel.addClass('active');
    }

    this.view.$mainLabel[this.isDisabled ? 'addClass' : 'removeClass']('disabled');

    this.view.$mainLabel.appendTo(this.view.$selectWrapper);
  }

  appendCustomTemplateParts() {

    this.view.$customTemplateParts.each((_, element) => {

      const $templatePart = $(element);
      $templatePart.appendTo(this.view.$materialOptionsList).wrap('<li></li>');
    });

    this.view.$btnSave.appendTo(this.view.$materialOptionsList); // @Depreciated
  }

  appendValidationFeedbackElements() {

    this.view.$validFeedback.insertAfter(this.view.$selectWrapper);
    this.view.$invalidFeedback.insertAfter(this.view.$selectWrapper);
  }

  enableValidation() {

    this.view.$nativeSelect.css({
      position: 'absolute',
      top: '1rem',
      left: '0',
      height: '0',
      width: '0',
      opacity: '0',
      padding: '0',
      'pointer-events': 'none'
    });

    if (this.view.$nativeSelect.attr('style').indexOf('inline!important') === -1) {

      this.view.$nativeSelect.attr('style', `${this.view.$nativeSelect.attr('style')} display: inline!important;`);
    }

    this.view.$nativeSelect.attr('tabindex', -1);
    this.view.$nativeSelect.data('inherit-tabindex', false);
  }

  setMaterialOptionsListMaxHeight() {

    const $tempWrapper = $('<div />').appendTo($('body'));
    $tempWrapper.css({
      position: 'absolute !important',
      visibility: 'hidden !important',
      display: 'block !important'
    });

    this.view.$materialOptionsList.show();
    const $optionsListClone = this.view.$materialOptionsList.clone().appendTo($tempWrapper);

    const multiplier = this.view.options.visibleOptions;
    let additionalHeight = 0;
    const $materialOptions = $optionsListClone.find('li').not('.disabled');
    const optionHeight = $materialOptions.first().height();
    const optionsCount = $materialOptions.length;

    if (this.isSearchable) {
      additionalHeight += this.view.$searchInput.height();
    }

    if (this.isMultiple) {
      additionalHeight += this.view.$toggleAll.height();
    }

    this.view.$materialOptionsList.hide();
    $tempWrapper.remove();

    if (multiplier >= 0 && multiplier < optionsCount) {

      const maxHeight = optionHeight * multiplier + additionalHeight;
      this.view.$materialOptionsList.css('max-height', maxHeight);
      this.view.$materialSelect.data('maxheight', maxHeight);
    }
  }

  addAccessibilityAttributes() {

    this.view.$materialSelect.attr({
      role: this.isSearchable ? 'combobox' : 'listbox',
      'aria-multiselectable': this.isMultiple,
      'aria-disabled': this.isDisabled,
      'aria-required': this.isRequired,
      'aria-labelledby': this.view.$mainLabel.attr('id'),
      'aria-haspopup': true,
      'aria-expanded': false
    });

    if (this.view.$searchInput) {

      this.view.$searchInput.attr('role', 'searchbox');
    }

    this.view.$materialOptionsList.find('li').each(function () {

      const $this = $(this);
      $this.attr({
        role: 'option',
        'aria-selected': $this.hasClass('active'),
        'aria-disabled': $this.hasClass('disabled')
      });
    });
  }

  markInitialized() {

    this.view.$nativeSelect.addClass('initialized');
  }

  appendSearchInputOption() {

    const placeholder = this.view.$nativeSelect.attr('searchable');
    const divClass = this.isDefaultMaterialInput ? '' : 'md-form';
    const inputClass = this.isDefaultMaterialInput ? 'select-default mb-2' : '';

    this.view.$searchInput = $(`<span class="search-wrap ml-2"><div class="${divClass} mt-0"><input type="text" class="search w-100 d-block ${inputClass}" tabindex="-1" placeholder="${placeholder}"></div></span>`);
    this.view.$materialOptionsList.append(this.view.$searchInput);
    this.view.$searchInput.on('click', (e) => e.stopPropagation());
  }

  appendAddOptionBtn() {

    this.view.$searchInput.append(this.view.$addOptionBtn);
  }

  buildMaterialOptions() {

    this.view.$nativeSelectChildren.each((index, option) => {

      const $this = $(option);

      if ($this.is('option')) {

        this.buildSingleOption($this, this.isMultiple ? 'multiple' : '');
      } else if ($this.is('optgroup')) {

        const $materialOptgroup = $(`<li class="optgroup"><span>${$this.attr('label')}</span></li>`);
        this.view.$materialOptionsList.append($materialOptgroup);

        const $optgroupOptions = $this.children('option');
        $optgroupOptions.each((index, optgroupOption) => {

          this.buildSingleOption($(optgroupOption), 'optgroup-option');
        });
      }
    });
  }

  appendToggleAllCheckbox() {

    const firstOption = this.view.$materialOptionsList.find('li').first();
    if (firstOption.hasClass('disabled') && firstOption.find('input').prop('disabled')) {
      firstOption.after(this.view.$toggleAll);
    } else {
      this.view.$materialOptionsList.find('li').first().before(this.view.$toggleAll);
    }

  }

  addNewOption() {

    const val = this.view.$searchInput.find('input').val();
    const $newOption = $(`<option value="${val.toLowerCase()}" selected>${val}</option>`).prop('selected', true);
    if (!this.isMultiple) {
      this.view.$nativeSelectChildren.each((index, option) => {
        $(option).attr('selected', false);
      });
    }
    this.view.$nativeSelect.append($newOption);
  }

  buildSingleOption($nativeSelectChild, type) {

    const disabled = $nativeSelectChild.is(':disabled') ? 'disabled' : '';
    const active = $nativeSelectChild.is(':selected') ? 'active' : '';
    const optgroupClass = type === 'optgroup-option' ? 'optgroup-option' : '';
    const iconUrl = $nativeSelectChild.data('icon');
    const fas = $nativeSelectChild.data('fas') ? `<i class="fa-pull-right m-2 fas fa-${$nativeSelectChild.data('fas')} ${this.view.options.fasClasses}"></i> ` : '';
    const far = $nativeSelectChild.data('far') ? `<i class="fa-pull-right m-2 far fa-${$nativeSelectChild.data('far')} ${this.view.options.farClasses}"></i> ` : '';
    const fab = $nativeSelectChild.data('fab') ? `<i class="fa-pull-right m-2 fab fa-${$nativeSelectChild.data('fab')} ${this.view.options.fabClasses}"></i> ` : '';

    const classes = $nativeSelectChild.attr('class');

    const iconHtml = iconUrl ? `<img alt="" src="${iconUrl}" class="${classes}">` : '';
    const checkboxHtml = this.isMultiple ? `<input type="checkbox" class="form-check-input" ${disabled}/><label></label>` : '';
    const secondaryText = $nativeSelectChild.data('secondary-text') ? `<p class="text-muted pt-0 mb-0" disabled>${$nativeSelectChild.data('secondary-text')}</p>` : '';

    this.view.$materialOptionsList.append($(`<li class="${disabled} ${active} ${optgroupClass} ${this.view.options.copyClassesOption ? classes : ''} ">${iconHtml}<span class="filtrable">${checkboxHtml} ${$nativeSelectChild.html()} ${fas} ${far} ${fab} ${secondaryText}</span></li>`));
  }
}
