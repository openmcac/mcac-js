import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    appendAnnouncement: function() {
      var bulletin = this.get('model');
      var announcements = bulletin.get('announcements');
      announcements.pushObject(this.store.createRecord('announcement', { position: announcements.get('length') + 1 }));
    },
    save: function() {
      var _this = this;
      var bulletin = _this.get('model');
      bulletin.set('publishedAt', moment(bulletin.get('publishedAt')).toDate());
      Pace.restart();
      bulletin.save().then(function() {
        bulletin.get('announcements').then(function(announcements) {
          announcements.save().then(function() {
            Pace.stop();
          });
        });
      });
    }
  }
});
