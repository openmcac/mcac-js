import Ember from 'ember';

export default Ember.Controller.extend({
  notify: Ember.inject.service("notify"),
  saveBulletinService: Ember.inject.service("save-bulletin"),
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
      if (this.get("saveBulletinService").save(bulletin)) {
        this.get("notify").success("Bulletin saved.");
        this.transitionToRoute("dashboard.index");
      } else {
        this.get("notify").alert("Failed to save bulletin. Please try again.");
      }
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
