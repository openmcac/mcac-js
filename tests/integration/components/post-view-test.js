import hbs from "htmlbars-inline-precompile";
import { moduleForComponent, test } from "ember-qunit";
import Post from "mcac/models/post";

moduleForComponent("post-view", {
  integration: true
});

test("renders the post", function(assert) {
  this.set("post", Post.create({ title: "Test post" }));
  
});
