import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortAscending: false,
  sortProperties: ["publishedAt", "name"],
  actions: {
    remove: function(bulletin) {
      bulletin.destroyRecord();
    }
  }
});
