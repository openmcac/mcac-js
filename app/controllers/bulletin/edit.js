import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend({
  notify: Ember.inject.service("notify"),
  actions: {
    appendAnnouncement(bulletin) {
      const announcements = bulletin.get('announcements');
      const newAnnouncement = this.store.createRecord('announcement', {
        position: announcements.get('length') + 1
      });
      announcements.pushObject(newAnnouncement);
    },
    saveBulletin(bulletin) {
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
    didUploadBanner(storageUrl, bulletin) {
      bulletin.set('bannerUrl', storageUrl);
    },
    didUploadAudio(storageUrl, bulletin) {
      bulletin.set('audioUrl', storageUrl);
    }
  })
});
