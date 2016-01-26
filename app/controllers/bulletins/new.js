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
    save: function() {
      var _this = this;
      var bulletin = _this.get('model');
      bulletin.set('publishedAt', moment(bulletin.get('publishedAt')).toDate());
      bulletin.save().then(function(savedBulletin) {
        _this.transitionToRoute('bulletin.edit', savedBulletin);
        _this.get("notify").
          info("Your bulletin was created! Now, let's create some announcements...");
      }, () => {
        _this.get("notify").alert("Failed to create bulletin.");
      });
    },
    didUploadBanner: function(storageUrl) {
      var bulletin = this.get('model');
      bulletin.set('bannerUrl', storageUrl);
    },
    didUploadAudio: function(storageUrl) {
      var bulletin = this.get('model');
      bulletin.set('audioUrl', storageUrl);
    }
  },
  disableSaveButton: Ember.computed("isValid", function() {
    return !this.get("isValid");
  })
});
