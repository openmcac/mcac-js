import Ember from "ember";
import newBulletinPage from "mcac/tests/helpers/pages/bulletins/new";
import nextService from 'mcac/utils/next-service';
import sessionData from '../../helpers/payloads/sessionData';
import startApp from "mcac/tests/helpers/start-app";
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';
import { module, test } from 'qunit';

let application;

module('Acceptance | bulletins/new', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test("it requires authentication", assert => {
  let group = server.create("group");
  Object.create(newBulletinPage()).visit(group.slug);

  andThen(() => {
    assert.equal(currentURL(), "/login");
  });
});

test("it can create a new bulletin", assert => {
  authenticateSession(application, sessionData);

  let group = server.create("group");
  newBulletinPage().visit(group.slug).
    name("New Bulletin").
    publishedAt("05/27/1984 9:30 AM").
    description("New bulletin description").
    serviceOrder("New service order").
    sermonNotes("New sermon notes").
    submit();

  andThen(() => {
    let bulletins = server.db.bulletins;
    let createdBulletin = bulletins[bulletins.length - 1];

    // it creates the bulletin
    assert.equal(createdBulletin.name, "New Bulletin");
    equalDate(assert, createdBulletin["published-at"], "05/27/1984 9:30 AM");
    assert.equal(createdBulletin.description, "New bulletin description");
    assert.equal(createdBulletin["service-order"], "New service order");
    assert.equal(createdBulletin["sermon-notes"], "New sermon notes");

    // it redirects to the edit page
    let editUrl = `/${group.slug}/bulletins/${createdBulletin.id}/edit`;
    assert.equal(currentURL(), editUrl);
  });
});

test("it populates default values", assert => {
  authenticateSession(application, sessionData);

  let group = server.create("group");
  let page = newBulletinPage().visit(group.slug);

  andThen(() => {
    assert.equal(page.name(), "Sunday Worship Service");
    assert.equal(page.serviceOrder(), "");
    equalDate(assert, page.publishedAt(), nextService());
    assert.equal(page.sermonNotes(), "");
  });
});

test("it defaults to last week's service order when available", assert => {
  authenticateSession(application, sessionData);

  let group = server.create("group");
  let lastWeekBulletin =
    server.create("bulletin", { "service-order": "My service order." });

  mockLastWeekBulletin(assert, server, group, lastWeekBulletin);

  let page = newBulletinPage().visit(group.slug);

  andThen(() => {
    let defaultServiceOrder = page.serviceOrder();
    assert.equal(defaultServiceOrder, lastWeekBulletin["service-order"]);
  });
});

function equalDate(assert, actual, expected) {
  assert.equal(window.moment(actual).toDate().getTime(),
               window.moment(expected).toDate().getTime());
}

function mockLastWeekBulletin(assert, server, group, lastWeekBulletin) {
  let done = assert.async();

  server.get("/api/v1/bulletins", (db, request) => {
    let bulletins = [lastWeekBulletin];

    assert.equal(request.queryParams["filter[latest_for_group]"],
                 `${group.id}`);

    done();

    return {
      data: bulletins.map(attrs => ({
        type: "bulletins",
        id: attrs.id,
        attributes: attrs,
        relationships: {
          groups: {
            links: {
              self: `/api/v1/bulletins/${attrs.id}/relationships/groups`,
              related: `/api/v1/bulletins/${attrs.id}/groups`
            }
          }
        }
      }))
    };
  });
}
