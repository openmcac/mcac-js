import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    const englishServiceId = 1;

    return Ember.RSVP.hash({
      bulletins: this.store.query('bulletin', {
        filter: { group: englishServiceId },
        page: { size: 3 },
        sort: "-published_at"
      })
    });
  }
});
