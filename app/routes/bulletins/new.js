import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var englishService = this.store.find('group', 1);
    return this.store.createRecord('bulletin', {
      publishedAt: new Date(),
      name: 'Sunday Worship Service',
      description: 'Default description',
      serviceOrder: 'Default service order',
      group: englishService
    });
  }
});
