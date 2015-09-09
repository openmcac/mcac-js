import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save: function() {
      let thiz = this;
      this.get("model").save().then(function() {
        thiz.transitionToRoute("groups");
      });
    },
    didUploadBanner: function(storageUrl) {
      let group = this.get('model');
      group.set('bannerUrl', storageUrl);
    }
  }
});
