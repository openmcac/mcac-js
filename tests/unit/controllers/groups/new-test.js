import Ember from "ember";
import { moduleFor, test } from "ember-qunit";

moduleFor("controller:groups/new", {
  needs: ['service:metrics']
});

test("saving banner url on didUploadBanner callback", function(assert) {
  let controller = this.subject();
  let storageUrl = "http://www.example.com/image.jpg";

  Ember.run(function() {
    controller.set("model", Ember.Object.create({ bannerUrl: "" }));
    controller.send("didUploadBanner", storageUrl);

    assert.equal(controller.get("model.bannerUrl"), storageUrl);
  });
});
