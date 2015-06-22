import Ember from "ember";

export default Ember.Component.extend({
  actions: {
    save: function() {
      this.sendAction("save", this.get("post"));
    },
    didUploadBanner: function(storageUrl) {
      this.set("post.bannerUrl", storageUrl);
    }
  }
});
