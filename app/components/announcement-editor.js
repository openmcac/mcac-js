import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    addAnnouncement: function() {
      this.sendAction('add-announcement', this.announcement.get('position'));
    },
    removeAnnouncement: function() {
      this.sendAction('remove-announcement',
                      this.announcement.get('position') - 1);
    }
  }
});
