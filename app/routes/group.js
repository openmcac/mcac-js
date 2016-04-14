import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    const filter = { slug: params.group_slug };
    return this.store.query('group', { filter: filter }).then((groups) => {
      return groups.get('firstObject');
    });
  },
  afterModel(model) {
    if (Ember.isNone(model)) {
      this.transitionTo("not-found", "404");
    }
  }
});
