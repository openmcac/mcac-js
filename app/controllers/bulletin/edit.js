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
    removeBanner: function() {
      this.get("model").set("bannerUrl", null);
    },
    didUpload: function(storageUrl) {
      this.get('model').set('bannerUrl', storageUrl);
    }
  },
  bannerPreviewStyle: function() {
    return "is-hidden";
  }.observes("model.bannerUrl")
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
