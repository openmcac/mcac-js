import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    reorderAnnouncements(announcements, draggedAnnouncement) {
      syncPositions(announcements);
      this.set("announcements", announcements);
    },
    addAnnouncement: function(index) {
      var announcements = this.get('announcements');
      var store = this.get('targetObject').store;

      let newAnnouncement = store.createRecord('announcement', {});
      newAnnouncement.set("bulletin", announcements.get("firstObject.bulletin"));
      announcements.insertAt(index, newAnnouncement);
      syncPositions(announcements);
    },
    removeAnnouncement: function(announcement) {
      var _this = this;
      Pace.restart();
      announcement.destroyRecord().then(function() {
        syncPositions(_this.get("announcements"));
        Pace.stop();
      });
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
