jQuery(($) => {

  $.fn.dateTimePicker = function(delimiter = ', ') {

    const $this = $(this)[0];

    let result = $(`.picker-opener[data-open='${$this.dataset.open}']`);
    const $timePicker = $(`.timepicker[data-open='${$this.dataset.open}']`);
    const $datePicker = $(`#${$this.dataset.open}`);

    $datePicker.pickadate({
      onClose: function () {

        const input = $timePicker.pickatime({
          afterHide: () => {
            $timePicker.trigger("change");
          }
        });
        const picker = input.pickatime('picker');
        picker.data('clockpicker').show();
      },
      format: 'yyyy/mm/dd',
      formatSubmit: 'yyyy/mm/dd',
    });

    $datePicker.on('change', () => {
      let timeValue = $timePicker.val();
      let dateValue = $datePicker.val();
      result[0].value = `${dateValue}${timeValue !=='' && dateValue !=='' ? delimiter : ''}${timeValue}`;
    });

    $timePicker.on('change', () => {
      let timeValue = $timePicker.val();
      let dateValue = $datePicker.val();
      result[0].value = `${dateValue}${timeValue !=='' && dateValue !=='' ? delimiter : ''}${timeValue}`;
    });

  };

});
