import Ember from 'ember';

export default Ember.ObjectController.extend({
  actions: {
    save: function() {
      var bulletin = this.get('model');
      bulletin.save();
    }
  }
});
