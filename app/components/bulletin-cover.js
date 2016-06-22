import Ember from "ember";

export default Ember.Component.extend({
  init() {
    this._super();
    this.get("resizeService").on("debouncedDidResize", () => {
      this.resizeCover();
    });
  },
  classNames: ["bulletin-cover"],
  resizeCover: Ember.on("didInsertElement", function() {
    Ember.$(".bulletin-cover").height(suitableScreenHeight());
  }),
  session: Ember.inject.service("session"),
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});

function suitableScreenHeight() {
  return Math.max(Ember.$(window).height() - 40, 320);
}
