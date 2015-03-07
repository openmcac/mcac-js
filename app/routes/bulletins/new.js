import Ember from 'ember';
import nextService from 'mcac/utils/next-service';

export default Ember.Route.extend({
  model: function() {
    var _this = this;
    var publishedAt = nextService();
    var group = this.modelFor('group');

    var defaultBulletin = _this.store.createRecord('bulletin', {
      publishedAt: publishedAt.toDate(),
      name: 'Sunday Worship Service',
      description: publishedAt.format('MMMM Do YYYY, h:mm a'),
      serviceOrder: 'Default service order',
      group: group
    });

    return defaultBulletin;
  }
});

function populateDefaultAnnouncements(store, bulletin) {
  var announcements =
      getLatestAnnouncementsPromise(store, bulletin.get('group').id);
  var defaultAnnouncements = [];

  announcements.then(function() {
    announcements.forEach(function(announcement) {
      defaultAnnouncements.push(store.createRecord('announcement', {
        description: announcement.get('description'),
        position: announcement.get('position'),
        bulletin: bulletin
      }));
    });
  });

  return defaultAnnouncements;
}

function getLatestAnnouncementsPromise(store, groupId) {
  return store.find('announcement', { latest_for_group: groupId });
}
