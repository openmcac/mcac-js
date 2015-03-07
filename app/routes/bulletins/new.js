import Ember from 'ember';
import nextService from 'mcac/utils/next-service';

export default Ember.Route.extend({
  model: function() {
    var _this = this;
    var publishedAt = nextService();
    var group = this.modelFor('group');

    var defaultBulletin = _this.store.createRecord('bulletin', {
      publishedAt: publishedAt.toDate(),
      name: 'Sunday Worship Service',
      description: publishedAt.format('MMMM Do YYYY, h:mm a'),
      serviceOrder: 'Default service order',
      group: group
    });

    return defaultBulletin;
  }
});
