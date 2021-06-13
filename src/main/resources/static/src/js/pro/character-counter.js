jQuery(function ($) {

  $.fn.characterCounter = function () {

    return this.each(function () {

      const $this = $(this);
      const hasLengthAttribute = $this.attr('length') !== undefined;

      if (hasLengthAttribute) {

        $this.on('input focus', updateCounter);
        $this.on('blur', removeCounterElement);

        addCounterElement($this);
      }
    });
  };

  function updateCounter() {

    const $this = $(this);
    const maxLength = Number($this.attr('length'));
    const actualLength = Number($this.val().length);
    const isValidLength = actualLength <= maxLength;

    $this.parent().find('span[class="character-counter"]')
      .html(`${actualLength}/${maxLength}`);

    addInputStyle(isValidLength, $this);
  }

  function addCounterElement($input) {

    const $counterElement = $('<span/>')
      .addClass('character-counter')
      .css('float', 'right')
      .css('font-size', '12px')
      .css('height', 1);

    $input.parent().append($counterElement);
  }

  function removeCounterElement() {

    $(this).parent().find('span[class="character-counter"]').html('');
  }

  function addInputStyle(isValidLength, $input) {

    const inputHasInvalidClass = $input.hasClass('invalid');
    if (isValidLength && inputHasInvalidClass) {

      $input.removeClass('invalid');
    } else if (!isValidLength && !inputHasInvalidClass) {

      $input.removeClass('valid');
      $input.addClass('invalid');
    }
  }

  $(document).ready(() => {

    $('input, textarea').characterCounter();
  });
});
