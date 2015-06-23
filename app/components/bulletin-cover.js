import Ember from "ember";

export default Ember.Component.extend({
  init() {
    this._super();
    this.get("resizeService").on("debouncedDidResize", () => {
      this.resizeCover();
    });
  },
  classNames: ["bulletin-cover"],
  resizeCover: function() {
    Ember.$(".bulletin-cover").height(suitableScreenHeight());
  }.on("didInsertElement")
});

function suitableScreenHeight() {
  return Math.max(Ember.$(window).height(), 320);
}
