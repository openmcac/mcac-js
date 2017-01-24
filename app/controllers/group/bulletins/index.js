import Ember from 'ember';

export default Ember.Controller.extend({
  sortProperties: ["publishedAt:desc", "name"],
  sortedBulletins: Ember.computed.sort("bulletins", "sortProperties"),
  actions: {
    remove: function(bulletin) {
      bulletin.destroyRecord();
    }
  }
});
