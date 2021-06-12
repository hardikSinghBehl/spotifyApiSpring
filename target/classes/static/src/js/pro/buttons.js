jQuery(($) => {
  const isTouchDevice = 'ontouchstart' in document.documentElement;

  const toggleOpen = (btn, open) => {
    if (open && !btn.hasClass('active') || !open && btn.hasClass('active')) {
      btn[open ? 'addClass' : 'removeClass']('active');
      const btnList = document.querySelectorAll('ul .btn-floating');
      btnList.forEach((el) => el.classList[open ? 'add' : 'remove']('shown'));
    }
  };

  const handleClick = btn => {
    if (btn.hasClass('active')) {
      toggleOpen(btn, false);
    } else {
      toggleOpen(btn, true);
    }
  };

  const $btn = $('.fixed-action-btn:not(.smooth-scroll) > .btn-floating');
  $btn.on('mouseenter', e => {
    if (!isTouchDevice) {
      toggleOpen($(e.currentTarget).parent(), true);
    }
  });
  $btn.parent().on('mouseleave', e => toggleOpen($(e.currentTarget), false));
  $btn.on('click', e => {
    e.preventDefault();
    handleClick($(e.currentTarget).parent());
  });

  $.fn.extend({
    openFAB() {
      toggleOpen($(this), true);
    },
    closeFAB() {
      toggleOpen($(this), false);
    }
  });
});

