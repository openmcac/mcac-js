import { moduleFor, test } from "ember-qunit";
import Ember from "ember";

moduleFor("controller:post/index", {
  needs: ['service:metrics']
});

test("displayPublishedAt: returns empty string when no date", function(assert) {
  let controller = this.subject();

  assert.equal(controller.get("displayPublishedAt"), "");
});

test("displayPublishedAt: returns a well-formatted date", function(assert) {
  let controller = this.subject();
  let model = Ember.Object.create({ publishedAt: "2015-03-07T03:58:00+00:00" });
  controller.set("model", model);

  assert.equal(controller.get("displayPublishedAt"), "March 6 2015, 10:58 pm");
});
