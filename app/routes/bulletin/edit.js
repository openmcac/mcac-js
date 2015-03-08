import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var _this = this;
    var bulletin = _this.modelFor('bulletin');

    bulletin.get('announcements').then(function(announcements) {
      if (!announcements.get('length')) {
        populateDefaultAnnouncements(_this.store, bulletin);
      }
    });

    return bulletin;
  }
});

function populateDefaultAnnouncements(store, bulletin) {
  var announcements =
      getLatestAnnouncementsPromise(store, bulletin.get('group').id);

  announcements.then(function() {
    announcements.forEach(function(announcement) {
      var announcementRecord = store.createRecord('announcement', {
        description: announcement.get('description'),
        position: announcement.get('position'),
        bulletin: bulletin
      });

      announcementRecord.save().then(function(savedAnnouncement) {
        bulletin.get('announcements').addObject(savedAnnouncement);
      });
    });
  });
}

function getLatestAnnouncementsPromise(store, groupId) {
  return store.find('announcement', { latest_for_group: groupId });
}
