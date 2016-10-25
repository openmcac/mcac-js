import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.query('group', {
     'filter[id]': 1
   }).then((groups) => {
     return groups.objectAt(0);
   });
  }
});
