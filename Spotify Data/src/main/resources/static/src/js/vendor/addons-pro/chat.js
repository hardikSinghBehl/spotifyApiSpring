const $myForm = $('#myForm');

$('#chat').on('click', function () {

  if ($myForm.hasClass('slim') || !$myForm.is(':visible')) {

    $myForm.css('display', 'block');
    $myForm.removeClass('slim');
  };
})

$('#closeButton').not('#toggle').on('click', function () {

  $myForm.hide();
})

$("#toggle").on('click', function () {

  $myForm.toggleClass('slim');
});

$("#exampleForm2").on("keypress", function(e) {
  const $eTargetVal = $(e.target).val();
  
  if (e.keyCode === 13 && $eTargetVal.length > 0) {
    const text = 
    `<div class="card bg-primary rounded w-75 float-right z-depth-0 mb-1 last">
      <div class="card-body p-2">
        <p class="card-text text-white">${$eTargetVal}</p>
      </div>
    </div>`;

    $(text).insertAfter(".last:last");
    $(this).val("");
  }
});

function getMessages(letter) {
  var div = $("#message");
  div.scrollTop(div.prop('scrollHeight'));
}

$(function() {
  getMessages();
});