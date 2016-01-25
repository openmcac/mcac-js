import Ember from 'ember';

export default Ember.Component.extend({
  announcementClass: Ember.computed("announcement.id", "announcement.isDeleted", function() {
    var announcementId = this.get('announcement.id');
    if (Ember.isNone(announcementId)) {
      announcementId = "new";
    }

    let deleted = this.get("announcement.isDeleted") ? "deleted" : ""

    return `announcement-editor announcement-editor-${announcementId} ${deleted}`;
  }),
  actions: {
    addAnnouncement: function() {
      this.sendAction('add-announcement', this.get("announcement.position"));
    }
  }
});
