import Ember from "ember";
import { moduleForComponent, test } from "ember-qunit";

var component;

moduleForComponent("image-preview", {
  beforeEach: function() {
    component = this.subject();
  }
});

test("it previews the associated url", function(assert) {
  var expectedUrl = "http://example.com/file.png";

  Ember.run(function() {
    component.set("url", expectedUrl);
  });

  this.render();

  assert.equal(this.$(".preview").attr("style"),
               `background-image: url('${expectedUrl}')`);
});

test("it hides the preview when there is no URL", function(assert) {
  this.render();
  assert.ok(this.$()[0].className.indexOf("is-hidden") > -1);
});

test("clears the url when the remove button is pressed", function(assert) {
  var expectedUrl = "http://example.com/file.png";

  Ember.run(function() {
    component.set("url", expectedUrl);
  });

  this.render();
  this.$().find(".remove").click();

  assert.equal(component.get("url"), "");
  assert.ok(this.$()[0].className.indexOf("is-hidden") > -1);
});
