import hbs from "htmlbars-inline-precompile";
import { moduleForComponent, test } from "ember-qunit";

moduleForComponent("post-view", {
  integration: true
});

test("renders the post", function(assert) {
  let post = { title: "Test post", contentHtml: "hello world!" };
  this.set("post", post);
  this.render(hbs`{{post-view post=post}}`);

  let $component = this.$('*[data-auto-id="post-view"]');

  assert.equal(element("title", $component)[0].textContent.trim(), post.title);
  assert.equal(element("content", $component)[0].textContent.trim(), post.contentHtml);
});

function element(id, scope) {
  return scope.find(`[data-auto-id='${id}']`);
}
