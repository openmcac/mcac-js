import Ember from "ember";

export default Ember.Component.extend({
  init() {
    this._super();
    this.get('resizeService').on('debouncedDidResize', () => {
      this.resizeCover();
    });
  },
  classNames: ["bulletin-cover"],
  resizeCover: function() {
    var screenHeight = Math.max(Ember.$(window).height(), 320);
    Ember.$(".bulletin-cover").height(screenHeight);
  }.on("didInsertElement")
});
