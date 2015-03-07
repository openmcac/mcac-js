import Ember from 'ember';

export default Ember.ObjectController.extend({
  actions: {
    save: function() {
      var _this = this;
      var bulletin = _this.get('model');
      bulletin.save().then(function(savedBulletin) {
        _this.transitionToRoute('bulletin.edit', savedBulletin);
      });
    }
  }
});
