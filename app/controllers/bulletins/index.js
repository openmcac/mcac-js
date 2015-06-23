import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ["publishedAt:desc", "name"],
  sortedBulletins: Ember.computed.sort("content", "sortProperties"),
  actions: {
    remove: function(bulletin) {
      bulletin.destroyRecord();
    }
  }
});
