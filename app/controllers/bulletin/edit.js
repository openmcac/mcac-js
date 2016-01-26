import Ember from 'ember';

export default Ember.Controller.extend({
  notify: Ember.inject.service("notify"),
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
      bulletin.save().then(() => {
        let position = 1;

        bulletin.get("sortedAnnouncements").forEach((announcement) => {
          if (!announcement.get("isDeleted")) {
            announcement.set("position", position++);
          }

          announcement.save().then(() => {}, () => {
            announcement.save();
          });
        });

        this.get("notify").success("Bulletin saved.");
      }, (response) => {
        this.get("notify").alert(`Failed to save bulletin: ${response.errors[0].title}`);
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
