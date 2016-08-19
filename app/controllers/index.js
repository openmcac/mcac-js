import Ember from 'ember';

export default Ember.Controller.extend({
  resizeService: Ember.inject.service(),
  actions: {
    viewOnlineSermons() {
      this.transitionToRoute("bulletin/sunday");
    }
  },
  resizeCover() {
    Ember.$(".theme-cover").height(suitableScreenHeight());
  },
  activate: function() {
    debugger;
    this.get("resizeService").on("debouncedDidResize", () => {
      this.resizeCover();
    });

    this.resizeCover();
  }
});

function suitableScreenHeight() {
  return Math.max(Ember.$(window).height() - 40, 320);
}
