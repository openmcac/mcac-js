import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save: function() {
      let group = this.get("model");
      let _this = this;
      group.save().then(function() {
        _this.transitionToRoute("groups.index");
      });
    },
    didUploadBanner: function(storageUrl) {
      this.get('model').set('bannerUrl', storageUrl);
    }
  }
});
