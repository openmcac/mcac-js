import Ember from 'ember';

export default Ember.Component.extend({
  announcementClass: Ember.computed('announcement.id', function() {
    var announcementId = this.get('announcement.id');
    if (Ember.isNone(announcementId)) {
      announcementId = "new";
    }

    return `announcement-editor announcement-editor-${announcementId}`;
  }),
  actions: {
    addAnnouncement: function() {
      this.sendAction('add-announcement', this.get("announcement.position"));
    },
    removeAnnouncement: function(announcement) {
      this.sendAction('remove-announcement', announcement);
    }
  }
});
