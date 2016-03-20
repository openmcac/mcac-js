import Ember from 'ember';

export default Ember.Component.extend({
  announcementClass: Ember.computed("announcement.id", "announcement.isDeleted", function() {
    let announcementId = this.get('announcement.id');
    if (Ember.isNone(announcementId)) {
      announcementId = "new";
    }

    let deleted = this.get("announcement.isDeleted") ? "deleted" : "";

    return `announcement-editor announcement-editor-${announcementId} ${deleted}`;
  })
});
