import Ember from 'ember';

export default Ember.Component.extend({
  announcementClass: function() {
    var announcementId = this.get('announcement.id');
    if (Ember.isNone(announcementId)) {
      announcementId = "new";
    }

    return `announcement-editor announcement-editor-${announcementId}`;
  }.property('announcement-id'),
  actions: {
    addAnnouncement: function() {
      this.sendAction('add-announcement', this.position);
    },
    removeAnnouncement: function(announcement) {
      this.sendAction('remove-announcement', announcement);
    }
  }
});
