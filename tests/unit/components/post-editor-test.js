import Ember from "ember";
import { moduleForComponent, test } from "ember-qunit";

var component, post;

moduleForComponent("post-editor", {
  needs: [
    "component:s3-upload",
    "component:image-preview",
    "component:markdown-textarea"
  ],
  beforeEach: function() {
    post = {
      bannerUrl: "http://example.com/image.png",
      content: "**Hello** world!",
      publishedAt: new Date(),
      slug: "test-post",
      tagList: "tag1, tag2",
      title: "Test Post",
      group: {
        slug: "english-service",
        name: "English Service"
      }
    };

    component = this.subject({ post: post });
  }
});

test("it allows user to edit the post", function(assert) {
  this.render();

  var $component = this.append();

  assert.equal($component.find(".post-title").val(), "Test Post");
  assert.equal($component.find(".tags").val(), "tag1, tag2");
  assert.equal($component.find(".content").val(), "**Hello** world!");
});

test("save: sends 'save' action with post to save", function(assert) {
  assert.expect(1);

  var targetObject = {
    externalAction: function(postToSave) {
      assert.equal(postToSave, post);
    }
  };

  this.render();

  component.set("save", "externalAction");
  component.set("targetObject", targetObject);

  var $component = this.append();

  $component.find(".save").click();
});

test("didUploadBanner: sets posts banner url with the new storage url",
     function(assert) {
  assert.expect(1);

  var storageUrl = "http://example.com/newimage.png";
  var targetObject = {
    externalAction: function(postToSave) {
      assert.equal(postToSave, post);
    }
  };

  this.render();

  component.set("didSavePost", "externalAction");
  component.set("targetObject", targetObject);

  Ember.run(function() {
    component.send("didUploadBanner", storageUrl);
  });

  assert.equal(component.get("post.bannerUrl"), storageUrl);
});
