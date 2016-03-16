import hbs from "htmlbars-inline-precompile";
import { moduleForComponent, test } from "ember-qunit";

moduleForComponent("announcements-editor", {
  integration: true
});

test("it renders an announcements editor", function(assert) {
  assert.expect(3);

  const announcements = [
    { url: "http://nba.com", description: "announcement 1", position: 1 },
    { url: "http://mcac.church", description: "announcement 2", position: 2 },
    { url: "", description: "announcement 3", position: 3 }
  ];

  enableAutoIdAttribute();

  this.set("announcements", announcements);

  this.set("removeAnnouncement", (actual) => {
    assert.equal(actual, announcements[1], "passes the announcement to remove");
  });

  this.set("appendAnnouncement", () => {
    assert.ok("sends action to append an announcement");
  });

  this.set("reorderAnnouncements", () => {
    // TODO test announcement reordering
  });

  this.render(hbs`
    {{announcements-editor announcements=announcements
      append=(action appendAnnouncement)
      remove=(action removeAnnouncement)
      reorder=(action reorderAnnouncements)}}
  `);

  assert.equal(find(this, "announcement-editor").length, 3);

  this.$(getAnnouncementEditor(this, 1)).
    find("*[data-auto-id='remove']").
    click();

  find(this, "append-announcement").click();
});

function find(context, key) {
  return context.$(selector(key));
}

function selector(key) {
  return `*[data-auto-id="announcements-editor"] *[data-auto-id="${key}"]`;
}

function getAnnouncementEditor(context, index) {
  return find(context, "announcement-editor")[index];
}

function enableAutoIdAttribute() {
  Ember.TextField.reopen({
    attributeBindings: ["data-auto-id"]
  });

  Ember.TextArea.reopen({
    attributeBindings: ["data-auto-id"]
  });
}
