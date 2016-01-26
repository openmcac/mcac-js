import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations, {
  validations: {
    "model.name": {
      presence: true
    },
    "model.publishedAt": {
      presence: true
    }
  },
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
            announcement.save().then(() => {}, () => {
              this.get("notify").alert("Failed to save announcement.");
            });
          });
        });

        this.get("notify").success("Bulletin saved.");
      }, () => {
        this.get("notify").alert("Failed to save bulletin");
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
  }),
  disableSaveButton: Ember.computed("isValid", function() {
    return !this.get("isValid");
  })
});
