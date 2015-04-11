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
      this.sendAction('append-announcement');
    }
  },
  onAnnouncementChange: function() {
    Ember.run.later(this, 'makeDraggable', 2000);
  }.on('didInsertElement'),
  makeDraggable: function() {
    var $announcementsEditor =
        Ember.$('#announcements-editor', this.element);
    $announcementsEditor.sortable('destroy');
    $announcementsEditor.sortable().
                         bind('sortupdate', onAnnouncementDragged(this));
  }
});

function onAnnouncementDragged(context) {
  return function(e, ui) {
    saveDraggedAnnouncementPosition(context, ui);
    syncPositions(context.get('announcements'));
    Ember.run.later(context, 'makeDraggable', 1000);
  };
}

function saveDraggedAnnouncementPosition(context, ui) {
  var announcement = getDraggedAnnouncement(context.get('announcements'),
                                            ui.item.data('id'));
  announcement.set('position', ui.item.index() + 1);
  announcement.save();
}

function syncPositions(announcements) {
  announcements.beginPropertyChanges();

  Ember.$('#announcements-editor .draggable-announcement').
        each(function(index, domAnnouncement) {
    var announcement =
        getDraggedAnnouncement(announcements, Ember.$(domAnnouncement).data('id'));
    announcement.set('position', index+1);
  });

  announcements.endPropertyChanges();
}

function getDraggedAnnouncement(announcements, announcementId) {
  return announcements.findBy('id', `${announcementId}`);
}
