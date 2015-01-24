import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    addAnnouncement: function() {
      this.sendAction('add-announcement', this.announcement.get('position'));
    }
  }
});
