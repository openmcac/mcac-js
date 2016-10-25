import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    viewGroup(slug) {
      this.transitionToRoute("group.index", slug);
    },
    viewOnlineSermons() {
      this.transitionToRoute("bulletin/sunday");
    }
  }
});


function suitableScreenHeight() {
  return Math.max(Ember.$(window).height() - 40, 320);
}
