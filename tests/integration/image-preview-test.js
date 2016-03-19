import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import page from "mcac/tests/pages/components/image-preview";

moduleForComponent("image-preview", "Integration | Component | ImagePreview", {
  integration: true,
  afterEach() {
    page.removeContext();
  }
});

test("Clearing an image preview", function(assert) {
  assert.expect(1);

  this.set("remove", () => assert.ok("the clearimage action is fired"));

  this.render(hbs`{{image-preview url="test.png" clearimage=(action remove)}}`);

  this.$("*[data-auto-id='image-preview'] *[data-auto-id='remove']").click();
});

test("Render with an image", function(assert) {
  assert.expect(1);

  const url = "http://test.com/img.png";
  this.set("url", url);
  this.set("noop", () => {});

  page.setContext(this).
    render(hbs`{{image-preview url=url clearimage=(action noop)}}`);

  assert.equal(page.url(), url);
});
