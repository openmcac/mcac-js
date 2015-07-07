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
      serviceOrder: '',
      group: group
    });

    let filter = { latest_for_group: group.get('id') };

    _this.store.find('bulletin', { filter: filter }).
                then(function(bulletins) {
      if (bulletins.get('length') === 0) { return; }

      defaultBulletin.set('serviceOrder',
                          bulletins.get('firstObject').get('serviceOrder'));
    });

    return defaultBulletin;
  }
});
