import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    reorderAnnouncements(announcements, draggedAnnouncement) {
      syncPositions(announcements);
      this.set("announcements", announcements);
    },
    addAnnouncement: function(index) {
      let announcements = this.get('announcements');
      let store = this.get('targetObject').store;

      let newAnnouncement = store.createRecord('announcement', {});
      newAnnouncement.set("bulletin", announcements.get("firstObject.bulletin"));
      announcements.insertAt(index, newAnnouncement);
      syncPositions(announcements);
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
  announcements.forEach((announcement, index) => {
    announcement.set("position", index + 1);
  })
}
