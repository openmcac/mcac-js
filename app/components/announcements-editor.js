import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    addAnnouncement: function(index) {
      var announcements = this.get('announcements');
      var store = this.get('targetObject').store;
      announcements.insertAt(index, store.createRecord('announcement', {}));
      syncPositions(this);
    },
    removeAnnouncement: function(announcement) {
      var _this = this;
      Pace.restart();
      announcement.destroyRecord().then(function() {
        syncPositions(_this);
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
                         bind('sortupdate', onAnnouncementDraggedFn(this));
  }
});

function onAnnouncementDraggedFn(context) {
  return function(e, ui) {
    saveDraggedAnnouncementPosition(context, ui.item);
    syncPositions(context);
  };
}

function saveDraggedAnnouncementPosition(context, $item) {
  var announcement = getDraggedAnnouncement(context.get('announcements'),
                                            $item.data('id'));
  announcement.set('position', $item.index() + 1);
  announcement.save();
}

function syncPositions(context) {
  var announcements = context.get('announcements');
  announcements.beginPropertyChanges();

  Ember.$('#announcements-editor .draggable-announcement').
        each(syncAnnouncementFn(announcements));

  announcements.endPropertyChanges();

  Ember.run.later(context, 'makeDraggable', 1000);
}

function syncAnnouncementFn(announcements) {
  return function(index, domAnnouncement) {
    var announcement =
        getDraggedAnnouncement(announcements, Ember.$(domAnnouncement).data('id'));
    announcement.set('position', index+1);
  };
}

function getDraggedAnnouncement(announcements, announcementId) {
  return announcements.findBy('id', `${announcementId}`);
}
