import Ember from 'ember';

export default Ember.Component.extend({
  init() {
    this._super();
    this.get("resizeService").on("debouncedDidResize", () => {
      this.resizeCover();
    });
  },
  classNames: ["cover-page"],
  resizeCover: Ember.on("didInsertElement", function() {
    Ember.$(".cover-page").height(suitableScreenHeight());
  })
});

function suitableScreenHeight() {
  return Math.max(Ember.$(window).height(), 320);
}
