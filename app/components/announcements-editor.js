import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    reorderAnnouncements(bulletin, announcements, draggedAnnouncement) {
      syncPositions(announcements);
      bulletin.set("announcements", announcements);
    },
    addAnnouncement: function(index) {
      this.get('bulletin.sortedAnnouncements').then((announcements) => {
        let store = this.get('targetObject').store;

        let newAnnouncement = store.createRecord('announcement', {});
        newAnnouncement.set("bulletin", this.get("bulletin"));
        announcements.insertAt(index, newAnnouncement);
        syncPositions(announcements);
      });
    },
    removeAnnouncement: function(announcement) {
      announcement.deleteRecord();
    },
    appendAnnouncement: function() {
      this.sendAction('append-announcement');
    }
  },
});

function syncPositions(announcements) {
  let position = 1;

  announcements.
    filter((a) => !a.get("isDeleted")).
    forEach((a) => { a.set("position", position++) })
}
