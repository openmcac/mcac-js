import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    let filter = { slug: params.group_slug };
    return this.store.find('group', { filter: filter }).
                then(function(groups) {
      return groups.get('firstObject');
    });
  }
});
