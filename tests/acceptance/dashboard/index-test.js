import Ember from "ember";
import page from "mcac/tests/pages/dashboard";
import sessionData from '../../helpers/payloads/sessionData';
import startApp from "mcac/tests/helpers/start-app";
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';
import { module, test } from 'qunit';

let application;

module('Acceptance | dashboard', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test("it requires authentication", assert => {
  page.visit();

  andThen(() => assert.equal(currentURL(), "/login"));
});

test("it lists the three latest bulletins", assert => {
  authenticateSession(application, sessionData);

  const group = server.create("group", { id: 1 });
  const bulletins = server.createList("bulletin", 3);
  mockLatestBulletins(assert, server, bulletins, group);

  page.visit();

  andThen(() => {
    assert.equal(page.bulletins(1).name(), bulletins[0].name);
    assert.equal(page.bulletins(2).name(), bulletins[1].name);
    assert.equal(page.bulletins(3).name(), bulletins[2].name);

    assert.equal(currentURL(), "/dashboard");
  });
});

function mockLatestBulletins(assert, server, bulletins, group) {
  const done = assert.async();

  // FIXME remove if unused
  server.get("/api/v1/bulletins/:id/relationships/group", () => {
    const p = {
      data: {
        type: "groups",
        id: group.id,
        attributes: group
      }
    };

    return p;
  });

  // FIXME remove if unused
  server.get("/api/v1/bulletins/:id/group", () => {
    const p = {
      data: {
        type: "groups",
        id: group.id,
        attributes: group
      }
    };

    return p;
  });

  server.get("/api/v1/bulletins", function(db, request) {
    assert.equal(request.queryParams.sort, "-published_at");
    assert.equal(request.queryParams["filter[group]"], "1");
    assert.equal(request.queryParams["page[size]"], "3");

    done();

    const p = {
      data: bulletins.map(attrs => ({
        type: "bulletins",
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
