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
    assert.equal(page.createBulletinUrl, "/english-service/bulletins/new");

    bulletins.forEach((bulletin, i) => {
      assert.equal(page.bulletins(i).name, bulletins[i].name);
      equalDate(assert, page.bulletins(i).publishedAt, bulletins[i]["published-at"]);
      assert.equal(page.bulletins(i).showUrl,
                   `/english-service/bulletins/${bulletins[i].id}`);
      assert.equal(page.bulletins(i).editUrl,
                   `/english-service/bulletins/${bulletins[i].id}/edit`);
    });

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
