import Ember from 'ember';

export default Ember.ObjectController.extend({
  actions: {
    save: function() {
      var _this = this;
      var bulletin = _this.get('model');
      bulletin.save().then(function(savedBulletin) {
        console.log('saved bulletin: ' + savedBulletin.get('id'));
      });

      bulletin.get('announcements').then(function(announcements) {
        announcements.save();
      });
    }
  }
});
