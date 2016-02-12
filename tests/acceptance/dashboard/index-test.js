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

  const bulletins = server.createList("bulletin", 3);
  mockLatestBulletins(assert, server, bulletins);

  page.visit();

  andThen(() => {
    assert.equal(page.createBulletinUrl(), "/english-service/bulletins/new");
    assert.equal(page.bulletins(1).name(), bulletins[0].name);
    equalDate(assert, page.bulletins(1).publishedAt(), bulletins[0]["published-at"]);
    assert.equal(page.bulletins(1).showUrl(),
                 `/english-service/bulletins/${bulletins[0].id}`);
    assert.equal(page.bulletins(1).editUrl(),
                 `/english-service/bulletins/${bulletins[0].id}/edit`);

    assert.equal(page.bulletins(2).name(), bulletins[1].name);
    equalDate(assert, page.bulletins(2).publishedAt(), bulletins[1]["published-at"]);
    assert.equal(page.bulletins(2).showUrl(),
                 `/english-service/bulletins/${bulletins[1].id}`);
    assert.equal(page.bulletins(2).editUrl(),
                 `/english-service/bulletins/${bulletins[1].id}/edit`);

    assert.equal(page.bulletins(3).name(), bulletins[2].name);
    equalDate(assert, page.bulletins(3).publishedAt(), bulletins[2]["published-at"]);
    assert.equal(page.bulletins(3).showUrl(),
                 `/english-service/bulletins/${bulletins[2].id}`);
    assert.equal(page.bulletins(3).editUrl(),
                 `/english-service/bulletins/${bulletins[2].id}/edit`);

    assert.equal(currentURL(), "/dashboard");
  });
});

function mockLatestBulletins(assert, server, bulletins) {
  const done = assert.async();

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

function equalDate(assert, actual, expected) {
  assert.equal(window.moment(actual).toDate().getTime(),
               window.moment(expected).toDate().getTime());
}
