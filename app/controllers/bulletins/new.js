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
    didUploadBanner(storageUrl, bulletin) {
      bulletin.set('bannerUrl', storageUrl);
    },
    didUploadAudio(storageUrl, bulletin) {
      bulletin.set('audioUrl', storageUrl);
    }
  }
});
