import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    addAnnouncement: function() {
      this.sendAction('add-announcement', this.position);
    },
    removeAnnouncement: function() {
      this.sendAction('remove-announcement', this.position - 1);
    }
  }
});
