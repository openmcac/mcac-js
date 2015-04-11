import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    addAnnouncement: function(index) {
      var announcements = this.get('announcements');
      var store = this.get('targetObject').store;
      announcements.insertAt(index, store.createRecord('announcement', {}));
      syncPositions(announcements);
    },
    removeAnnouncement: function(index) {
      var announcements = this.get('announcements');
      var announcement = announcements.objectAt(index);
      Pace.restart();
      announcement.destroyRecord().then(function() {
        syncPositions(announcements);
        Pace.stop();
      });
    },
    appendAnnouncement: function() {
      var announcements = this.get('announcements');
      var store = this.get('targetObject').store;
      announcements.pushObject(store.createRecord('announcement', {}));
      syncPositions(announcements);
    }
  },
  makeDraggable: function() {
    Ember.$('#announcements-editor', this.element).
          sortable().
          bind('sortupdate', onAnnouncementDragged(this));
  }.on('didInsertElement')
});

function onAnnouncementDragged(context) {
  return function(e, ui) {
    saveDraggedAnnouncementPosition(context, ui);
  };
}

function saveDraggedAnnouncementPosition(context, ui) {
  var announcement = getDraggedAnnouncement(context.get('announcements'), ui);
  announcement.set('position', ui.item.index() + 1);
  announcement.save();
}

function getDraggedAnnouncement(announcements, ui) {
  return announcements.findBy('id', `${ui.item.data('id')}`);
}

function syncPositions(announcements) {
  var i = 1;
  announcements.forEach(function(announcement) {
    announcement.set('position', i++);
  });
}
