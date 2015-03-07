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

function cloneAnnouncements(store, announcements) {
  var clonedAnnouncements = [];

  announcements.forEach(function(announcement) {
    clonedAnnouncements.push(store.createRecord('announcement', {
      description: announcement.get('description'),
      position: announcement.get('position'),
      bulletin: announcement.get('bulletin')
    }));
  });

  return clonedAnnouncements;
}
