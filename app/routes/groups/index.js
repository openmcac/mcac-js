import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.findAll("group");
  },
  setupController: function(controller, groups) {
    controller.set("model", groups);
  }
});
