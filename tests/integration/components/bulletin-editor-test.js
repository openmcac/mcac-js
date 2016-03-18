import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bulletin-editor', 'Integration | Component | bulletin editor', {
  integration: true
});

test('it fires the removeannouncement action with the announcement to remove',
    function(assert) {
  assert.expect(1);

  enableAutoIdAttribute();

  const announcements = [
    { url: "http://nba.com", description: "announcement 1", position: 1 },
    { url: "", description: "announcement 2", position: 2 },
    { url: "http://mcac.church", description: "announcement 3", position: 3 }
  ];

  const bulletin = {
    name: "Sunday Worship Service",
    publishedAt: new Date(),
    description: "My description",
    bannerUrl: "",
    audioUrl: "",
    serviceOrder: "My service order",
    sermonNotes: "My sermon notes",
    sortedAnnouncements: announcements
  };

  this.set("bulletin", bulletin);

  this.set("removeAnnouncement", (actual) => {
    assert.equal(actual, announcements[2]);
  });

  this.set("notFired", () => {
    assert.notOk("should not have fired this action");
  });

  this.render(hbs`
    {{bulletin-editor
        bulletin=bulletin
        onsave=(action notFired)
        appendannouncement=(action notFired)
        removeannouncement=(action removeAnnouncement)
        reorderannouncements=(action notFired)}}
  `);

  this.$("*[data-auto-id='announcement-editor'] *[data-auto-id='remove']")[2].
    click();
});

test('it fires the appendannouncement action', function(assert) {
  assert.expect(1);

  enableAutoIdAttribute();

  const announcements = [
    { url: "http://nba.com", description: "announcement 1", position: 1 },
    { url: "http://mcac.church", description: "announcement 2", position: 2 },
    { url: "", description: "announcement 3", position: 3 }
  ];

  const bulletin = {
    name: "Sunday Worship Service",
    publishedAt: new Date(),
    description: "My description",
    bannerUrl: "",
    audioUrl: "",
    serviceOrder: "My service order",
    sermonNotes: "My sermon notes",
    announcements: announcements
  };

  this.set("bulletin", bulletin);

  this.set("appendAnnouncement", () => {
    assert.ok("fires action to append announcement");
  });

  this.set("notFired", () => {
    assert.notOk("should not have fired this action");
  });

  this.render(hbs`
    {{bulletin-editor
        bulletin=bulletin
        onsave=(action notFired)
        appendannouncement=(action appendAnnouncement)
        removeannouncement=(action notFired)
        reorderannouncements=(action notFired)}}
  `);

  this.$("*[data-auto-id='append-announcement']").click();
});

function enableAutoIdAttribute() {
  Ember.TextField.reopen({
    attributeBindings: ["data-auto-id"]
  });

  Ember.TextArea.reopen({
    attributeBindings: ["data-auto-id"]
  });
}
