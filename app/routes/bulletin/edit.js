import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var bulletin = this.modelFor('bulletin');

    populateDefaultAnnouncements(this.store, bulletin);

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
