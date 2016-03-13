import hbs from "htmlbars-inline-precompile";
import { moduleForComponent, test } from "ember-qunit";

moduleForComponent("announcement-editor", {
  integration: true
});

test("it renders an announcement editor", function(assert) {
  assert.expect(3);

  const description = "a description";
  const url = "a url";
  const announcement = { url: url, description: description };

  enableAutoIdAttribute();

  this.set("announcement", announcement);

  this.set("externalAction", (actual) => {
    assert.equal(actual, announcement, "passes the announcement to remove");
  });

  this.render(hbs`
    {{announcement-editor
      announcement=announcement
      removeannouncement=(action externalAction)}}
  `);

  assert.equal(find(this, "url").val(), announcement.url);
  assert.equal(find(this, "description").val(), announcement.description);

  find(this, "remove").click();
});

function find(context, key) {
  return context.$(selector(key));
}

function selector(key) {
  return `*[data-auto-id="announcement-editor"] *[data-auto-id="${key}"]`;
}

function enableAutoIdAttribute() {
  Ember.TextField.reopen({
    attributeBindings: ["data-auto-id"]
  });

  Ember.TextArea.reopen({
    attributeBindings: ["data-auto-id"]
  });
}
