import Ember from 'ember';

function syncPositions(announcements) {
  var i = 1;
  announcements.forEach(function(announcement) {
    announcement.set('position', i++);
  });
}

export default Ember.Controller.extend({
  actions: {
    addAnnouncement: function(index) {
      var announcements = this.model.get('announcements');
      announcements.insertAt(index, this.store.createRecord('announcement', {}));
      syncPositions(announcements);
    }
  }
});
