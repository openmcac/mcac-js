import Ember from "ember";
import page from "mcac/tests/pages/page-index";
import startApp from "mcac/tests/helpers/start-app";
import { module, test } from 'qunit';

let application;

module('Acceptance | PageIndex', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test("it renders the specified page", assert => {
  const p = server.create("post", { kind: "page" });
  const group = server.create("group");
  mockPageToFetch(assert, server, p);

  page.visit({ groupSlug: group.slug, slug: p.slug });

  andThen(() => {
    assert.equal(currentURL(), `/${group.slug}/${p.slug}`);
    assert.equal(page.title(), p.title);
    assert.equal(page.content().replace(/\s/g, ''),
                 p.content.replace(/\s/g, ''));
  });
});

function mockPageToFetch(assert, server, page) {
  const done = assert.async();

  server.get("/api/v1/posts", function(db, request) {
    assert.equal(request.queryParams["filter[group_id]"], "1");
    assert.equal(request.queryParams["filter[kind]"], "1");
    assert.equal(request.queryParams["filter[slug]"], page.slug);

    done();

    const p = {
      data: [page].map(attrs => ({
        type: "posts",
        id: attrs.id,
        attributes: attrs,
        relationships: {
          group: {
            links: {
              self: `/api/v1/bulletins/${attrs.id}/relationships/group`,
              related: `/api/v1/bulletins/${attrs.id}/group`
            }
          }
        }
      }))
    };

    return p;
  });
}
