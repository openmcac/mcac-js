import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    viewEnglishService() {
      this.transitionToRoute("group.index", "english-service");
    },
    viewOnlineSermons() {
      this.transitionToRoute("bulletin/sunday");
    }
  }
});

function suitableScreenHeight() {
  return Math.max(Ember.$(window).height() - 40, 320);
}
