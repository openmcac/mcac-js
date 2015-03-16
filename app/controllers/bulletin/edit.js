import Ember from 'ember';

export default Ember.ObjectController.extend({
  actions: {
    save: function() {
      var _this = this;
      var bulletin = _this.get('model');
      bulletin.set('publishedAt', moment(bulletin.get('publishedAt')).toDate());
      bulletin.save().then(function() {
        bulletin.get('announcements').then(function(announcements) {
          announcements.save();
        });
      });
    }
  }
});
