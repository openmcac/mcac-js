import ENV from "mcac/config/environment";
import Ember from "ember";
import page from "mcac/tests/pages/group-index";
import startApp from "mcac/tests/helpers/start-app";
import { test } from 'qunit';
import moduleForAcceptance from 'mcac/tests/helpers/module-for-acceptance'

let application;

moduleForAcceptance('Acceptance | group/index', {
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
  const group = server.create("group", { slug: "random" });
  const posts = server.createList("post", 15, { group });
  server.createList("post", 5, { group });

  page.visit({ slug: group.slug });

  andThen(() => {
    ["name", "shortDescription", "meetDetails", "targetAudience"].
      forEach(key => assert.equal(page[key], group[key]));

    assert.equal(page.bannerUrl(), `https://res.cloudinary.com/${ENV['CLOUDINARY_CLOUD_NAME']}/image/fetch/w_1920/${group.bannerUrl}`);
    assert.equal(page.profilePictureUrl(), `https://res.cloudinary.com/${ENV['CLOUDINARY_CLOUD_NAME']}/image/fetch/w_200/${group.profilePictureUrl}`);

    assert.equal(page.posts().count, 15);
    posts.forEach(function(post, i) {
      assert.equal(page.posts(i).title, posts[i].title);
    });
  });
});
