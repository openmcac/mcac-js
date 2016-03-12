import Ember from "ember";
import page from "mcac/tests/pages/new-bulletin";
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
  const group = server.create("group");
  page.visit({ groupSlug: group.slug });

  andThen(() => {
    assert.equal(currentURL(), "/login");
  });
});

test("it can create a new bulletin", assert => {
  authenticateSession(application, sessionData);

  const group = server.create("group");

  page.
    visit({ groupSlug: group.slug }).
    fillName("New Bulletin").
    fillPublishedAt("05/27/1984 9:30 AM").
    fillDescription("New bulletin description").
    fillServiceOrder("New service order").
    fillSermonNotes("New sermon notes").
    submit();

  andThen(() => {
    const bulletins = server.db.bulletins;
    const createdBulletin = bulletins[bulletins.length - 1];

    assert.equal(createdBulletin.name, page.name);
    assert.equal(createdBulletin.description, page.description);
    equalDate(assert, createdBulletin["published-at"], page.publishedAt);
    assert.equal(createdBulletin["sermon-notes"], page.sermonNotes);
    assert.equal(createdBulletin["service-order"], page.serviceOrder);
    assert.equal(currentURL(),
                 `/${group.slug}/bulletins/${createdBulletin.id}/edit`);
  });
});

test("it populates default values", assert => {
  authenticateSession(application, sessionData);

  const group = server.create("group");
  page.visit({ groupSlug: group.slug });

  andThen(() => {
    assert.equal(page.name, "Sunday Worship Service");
    assert.equal(page.serviceOrder, "");
    equalDate(assert, page.publishedAt, nextService());
    assert.equal(page.sermonNotes, "");
  });
});

test("it defaults to last week's service order when available", assert => {
  authenticateSession(application, sessionData);

  const group = server.create("group");
  const lastWeekBulletin = server.create("bulletin");

  mockLastWeekBulletin(assert, server, group, lastWeekBulletin);

  page.visit({ groupSlug: group.slug });

  andThen(() => {
    assert.equal(page.serviceOrder, lastWeekBulletin["service-order"]);
  });
});

function mockLastWeekBulletin(assert, server, group, lastWeekBulletin) {
  const done = assert.async();

  server.get("/api/v1/bulletins", (db, request) => {
    const bulletins = [lastWeekBulletin];

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

function equalDate(assert, actual, expected) {
  assert.equal(window.moment(actual).toDate().getTime(),
               window.moment(expected).toDate().getTime());
}
