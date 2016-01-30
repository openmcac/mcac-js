import Ember from "ember";
import NewBulletinPage from "mcac/tests/page-objects/new-bulletin";
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
  new NewBulletinPage({ assert }).
    visit(group.slug).
    assertURL("/login");
});

test("it can create a new bulletin", assert => {
  authenticateSession(application, sessionData);

  let group = server.create("group");
  new NewBulletinPage({ assert }).
    visit(group.slug).
    fillInName("New Bulletin").
    fillInPublishedAt("05/27/1984 9:30 AM").
    fillInDescription("New bulletin description").
    fillInServiceOrder("New service order").
    fillInSermonNotes("New sermon notes").
    clickSubmit().
    assertCreatedBulletin(server).
    assertRedirectToEditPage(server, group.slug);
});

test("it populates default values", assert => {
  authenticateSession(application, sessionData);

  let group = server.create("group");
  new NewBulletinPage({ assert }).
    visit(group.slug).
    assertName("Sunday Worship Service").
    assertServiceOrder("").
    assertPublishedAt(nextService()).
    assertSermonNotes("");
});

test("it defaults to last week's service order when available", assert => {
  authenticateSession(application, sessionData);

  let group = server.create("group");
  let lastWeekBulletin = server.create("bulletin");

  mockLastWeekBulletin(assert, server, group, lastWeekBulletin);

  new NewBulletinPage({ assert }).
    visit(group.slug).
    assertServiceOrder(lastWeekBulletin["service-order"]);
});

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
