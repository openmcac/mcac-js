import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    appendAnnouncement: function() {
      var bulletin = this.get('model');
      var announcements = bulletin.get('announcements');
      announcements.pushObject(this.store.createRecord('announcement', { position: announcements.get('length') + 1 }));
    },
    save: function() {
      var _this = this;
      var bulletin = _this.get('model');
      bulletin.set('publishedAt', moment(bulletin.get('publishedAt')).toDate());
      Pace.restart();
      bulletin.save().then(function() {
        saveNextAnnouncement(bulletin);
      });
    },
    didUploadBanner: function(storageUrl) {
      this.get('model').set('bannerUrl', storageUrl);
    },
    didUploadAudio: function(storageUrl) {
      this.get('model').set('audioUrl', storageUrl);
    }
  },
  bannerPreviewStyle: Ember.observer("model.bannerUrl", function() {
    return "is-hidden";
  })
});

function saveNextAnnouncement(bulletin) {
  function next() {
    saveNextAnnouncement(bulletin);
  }

  var unsavedAnnouncement =
    bulletin.get('unsavedAnnouncements').get('firstObject');

  if (unsavedAnnouncement) {
    unsavedAnnouncement.save().then(next);
  } else {
    Pace.stop();
  }
}
