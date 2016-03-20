import Ember from 'ember';

export default Ember.Controller.extend({
  notify: Ember.inject.service("notify"),
  actions: {
    reorderAnnouncements(_, announcements) {
      syncPositions(announcements);
      this.set("model.announcements", announcements);
    },
    removeAnnouncement(announcement) {
      announcement.deleteRecord();
    },
    appendAnnouncement() {
      this.get("model.announcements").then((announcements) => {
        const newAnnouncement = this.store.createRecord('announcement', {
          position: announcements.get('length') + 1
        });
        announcements.pushObject(newAnnouncement);
      });
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
    clearBanner() {
      this.set("model.bannerUrl", "");
    },
    clearAudio() {
      this.set("model.audioUrl", "");
    },
    didUploadBanner(storageUrl) {
      this.set("model.bannerUrl", storageUrl);
    },
    didUploadAudio(storageUrl) {
      this.set("model.audioUrl", storageUrl);
    }
  }
});

function syncPositions(announcements) {
  announcements.
    filter((a) => !a.get("isDeleted")).
    forEach((a, i) => a.set("position", ++i));
}
