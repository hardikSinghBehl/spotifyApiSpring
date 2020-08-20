jQuery(function ($) {

  $(document).on('change', '.file-field input[type="file"]',  function() {
    
    const $this = $(this);
    const $fileField = $this.closest('.file-field');
    const $pathInput = $fileField.find('input.file-path');
    const files = $this.get(0).files;
    let fileNames = [];
    
    if (Array.isArray(files)) {
      fileNames = files.map(file => file.name);
    } else {
      fileNames = Object.values(files).map(file => file.name);
    }
    $pathInput.val(fileNames.join(', '));
    $pathInput.trigger('change');
  });
});
