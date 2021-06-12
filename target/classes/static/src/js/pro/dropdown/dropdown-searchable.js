jQuery(($) => {

  class DropdownSearchable {

    constructor($searchWrappers, options = {}) {

      this.$searchWrappers = $searchWrappers;
      this.options = {
        color: this.fallback().or(options.color).or('#000').value(),
        backgroundColor: this.fallback().or(options.backgroundColor).or('').value(),
        fontSize: this.fallback().or(options.fontSize).or('.9rem').value(),
        fontWeight: this.fallback().or(options.fontWeight).or('400').value(),
        borderRadius: this.fallback().or(options.borderRadius).or('').value(),
        borderColor: this.fallback().or(options.borderColor).or('').value(),
        margin: this.fallback().or(options.margin).or('').value()
      };
    }

    init() {

      this.bindSearchEvents();

      return this.$searchWrappers.css({
        color: this.options.color,
        backgroundColor: this.options.backgroundColor,
        fontSize: this.options.fontSize,
        fontWeight: this.options.fontWeight,
        borderRadius: this.options.borderRadius,
        borderColor: this.options.borderColor,
        margin: this.options.margin
      });
    }

    bindSearchEvents() {

      this.$searchWrappers.each(function () {

        const $searchInput = $(this).find('input').first();
        $searchInput.on('keyup', () => {

          const $linksInDropMenu = $searchInput.closest('div[id]').find('a, li');
          $linksInDropMenu.each(function () {

            const $this = $(this);
            if ($this.html().toLowerCase().indexOf($searchInput.val().toLowerCase()) > -1) {

              $this.css({
                display: ''
              });
            } else {

              $this.css({
                display: 'none'
              });
            }
          });
        });
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

  $.fn.mdbDropSearch = function (options) {

    const dropdownSearchable = new DropdownSearchable(this, options);
    return dropdownSearchable.init();
  };
});
