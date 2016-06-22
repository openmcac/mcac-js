import ENV from "mcac/config/environment";
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

  const posts = server.createList("post", 3);
  mockLatestPosts(assert, server, group.id, posts);

  page.visit({ slug: group.slug });

  andThen(() => {
    assert.equal(page.name, group.name);
    assert.equal(page.shortDescription, group["short-description"]);
    assert.equal(page.bannerUrl(), `https://res.cloudinary.com/${ENV['CLOUDINARY_CLOUD_NAME']}/image/fetch/w_1920/${group["banner-url"]}`);
    assert.equal(page.profilePictureUrl(), `https://res.cloudinary.com/${ENV['CLOUDINARY_CLOUD_NAME']}/image/fetch/w_200/${group["profile-picture-url"]}`);
    assert.equal(page.meetDetails, group["meet-details"]);
    assert.equal(page.targetAudience, group["target-audience"]);

    posts.forEach(function(post, i) {
      assert.equal(page.posts(i).title, posts[i].title);
    });
  });
});

function mockLatestPosts(assert, server, groupId, posts) {
  const done = assert.async();

  server.get("/api/v1/posts", function(db, request) {
    assert.equal(request.queryParams.sort, "-published_at");
    assert.equal(request.queryParams["filter[group]"], `${groupId}`);
    assert.equal(request.queryParams["page[size]"], "5");

    done();

    return {
      data: posts.map(attrs => ({
        type: "posts",
        id: attrs.id,
        attributes: attrs,
        relationships: {
          group: {
            links: {
              self: `/api/v1/posts/${attrs.id}/relationships/group`,
              related: `/api/v1/posts/${attrs.id}/group`
            }
          }
        }
      }))
    };
  });
}
