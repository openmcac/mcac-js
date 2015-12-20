import Ember from 'ember';
import nextService from 'mcac/utils/next-service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    var publishedAt = nextService();
    var group = this.modelFor('group');

    var defaultBulletin = this.store.createRecord('bulletin', {
      publishedAt: publishedAt.toDate(),
      name: 'Sunday Worship Service',
      description: publishedAt.format('MMMM Do YYYY, h:mm a'),
      serviceOrder: '',
      group: group
    });

    let filter = { latest_for_group: group.get('id') };

    this.store.query('bulletin', { filter: filter }).then(function(bulletins) {
      if (bulletins.get('length') === 0) { return; }

      defaultBulletin.set('serviceOrder',
                          bulletins.get('firstObject').get('serviceOrder'));
    });

    return defaultBulletin;
  }
});
