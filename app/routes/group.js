import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('group', { slug: params.group_slug })
              .then(function(groups) {
      return groups.get('firstObject');
    });
  }
});
