import Ember from 'ember';

export default Ember.Controller.extend({
  notify: Ember.inject.service("notify"),
  actions: {
    saveBulletin(bulletin) {
      bulletin.set('publishedAt', moment(bulletin.get('publishedAt')).toDate());
      bulletin.save().then((savedBulletin) => {
        this.transitionToRoute('bulletin.edit', savedBulletin);
        this.get("notify").
          info("Your bulletin was created! Now, let's create some announcements...");
      }, () => {
        this.get("notify").alert("Failed to create bulletin.");
      });
    },
    didUploadBanner(storageUrl) {
      this.set("model.bannerUrl", storageUrl);
    },
    didUploadAudio(storageUrl) {
      this.set("model.audioUrl", storageUrl);
    },
    clearBanner() {
      this.set("model.bannerUrl", "");
    },
    clearAudio() {
      this.set("model.audioUrl", "");
    },
    noop() {}
  }
});
