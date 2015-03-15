import Ember from 'ember';

export default Ember.Component.extend({
  announcementClass: function() {
    return 'announcement-editor announcement-editor-' + this.position;
  }.property('position'),
  actions: {
    addAnnouncement: function() {
      this.sendAction('add-announcement', this.position);
    },
    removeAnnouncement: function() {
      this.sendAction('remove-announcement', this.position - 1);
    }
  }
});
