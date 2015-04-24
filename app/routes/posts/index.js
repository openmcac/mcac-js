import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    var group = this.modelFor('group');
    return this.store.find('post', { group: group.get('id') });
  }
});
