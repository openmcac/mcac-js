import Ember from "ember";
import page from "mcac/tests/pages/group-index";
import startApp from "mcac/tests/helpers/start-app";
import { module, test } from 'qunit';

let application;

module('Acceptance | group/index', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test("handles groups that do not exist", function(assert) {
  page.visit({ slug: "random" });

  andThen(() => {
    assert.ok(find("*[data-test-id='not-found']").length);
  });
});

test("renders appropriate group details", function(assert) {
  const group = server.create("group", {
    slug: "random"
  });

  page.visit({ slug: group.slug });

  andThen(() => {
    assert.equal(page.name, group.name);
    assert.equal(page.shortDescription, group["short-description"]);
    assert.equal(page.bannerUrl(), group["banner-url"]);
    assert.equal(page.profilePictureUrl(), group["profile-picture-url"]);
    assert.equal(page.meetDetails, group["meet-details"]);
    assert.equal(page.targetAudience, group["target-audience"]);
  });
});
