import Ember from "ember";
import { moduleFor, test } from "ember-qunit";

moduleFor("controller:bulletin/edit", "Unit | Controller | Edit Bulletin", {
  needs: ['service:metrics', 'service:router-scroll']
});

test('Reordering announcements', function(assert) {
  const announcements = [
    Ember.Object.create({
      description: "announcement 1",
      isDeleted: false
    }),
    Ember.Object.create({
      description: "announcement 111",
      isDeleted: true
    }),
    Ember.Object.create({
      description: "announcement 2",
      isDeleted: false
    }),
    Ember.Object.create({
      description: "announcement 222",
      isDeleted: true
    }),
    Ember.Object.create({
      description: "announcement 3",
      isDeleted: false
    })
  ];

  assert.expect(announcements.length * 2);

  const controller = this.subject();
  controller.set("model", Ember.Object.create());
  controller.send("reorderAnnouncements", [], announcements);

  const actualAnnouncements = controller.get("model.announcements");

  assert.equal(actualAnnouncements[0].get("description"),
               announcements[0].get("description"));
  assert.equal(actualAnnouncements[0].get("position"), 1);

  assert.equal(actualAnnouncements[1].get("description"),
               announcements[1].get("description"));
  assert.ok(actualAnnouncements[1].get("isDeleted"));

  assert.equal(actualAnnouncements[2].get("description"),
               announcements[2].get("description"));
  assert.equal(actualAnnouncements[2].get("position"), 2);

  assert.equal(actualAnnouncements[3].get("description"),
               announcements[3].get("description"));
  assert.ok(actualAnnouncements[3].get("isDeleted"));

  assert.equal(actualAnnouncements[4].get("description"),
               announcements[4].get("description"));
  assert.equal(actualAnnouncements[4].get("position"), 3);
});
