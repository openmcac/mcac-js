import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var group = this.modelFor('group');
    return this.store.find('bulletin', { group: group.get('id') });
  }
});
