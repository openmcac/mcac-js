import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    let group = this.modelFor('group');
    let filter = { group: group.get('id') };

    return Ember.RSVP.hash({
      bulletins: this.store.query('bulletin', { filter: filter })
    });
  },
  setupController: function(controller, models) {
    controller.setProperties(models);
  }
});
