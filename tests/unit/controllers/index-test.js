import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:index', 'Unit | Controller | index', {
  needs: ['service:metrics', 'service:router-scroll']
});

// Replace this with your real tests.
test("viewOnlineSermons: it redirects to sunday's bulletin", function(assert) {
  const controller = this.subject();

  const done = assert.async();
  controller.transitionToRoute = function(name) {
    assert.equal(name, "bulletin/sunday");
    done();
  };

  controller.send("viewOnlineSermons");
});

test("viewEnglishService: it redirects to english service hub", function(assert) {
  const controller = this.subject();

  const done = assert.async();
  controller.transitionToRoute = function(name, model) {
    assert.equal(name, "group.index");
    assert.equal(model, "english-service");
    done();
  };

  controller.send("viewEnglishService");
});
