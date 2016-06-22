import hbs from "htmlbars-inline-precompile";
import { moduleForComponent, test } from "ember-qunit";

moduleForComponent("page-view", {
  integration: true
});

test("renders the page", function(assert) {
  let page = { title: "Test page", contentHtml: "hello world!" };
  this.set("page", page);
  this.render(hbs`{{page-view page=page}}`);

  let $component = this.$('*[data-auto-id="page-view"]');

  assert.equal(element("title", $component)[0].textContent.trim(), page.title);
  assert.equal(element("content", $component)[0].textContent.trim(), page.contentHtml);
});

function element(id, scope) {
  return scope.find(`[data-auto-id='${id}']`);
}
