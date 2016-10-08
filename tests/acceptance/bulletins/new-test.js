import Ember from "ember";
import page from "mcac/tests/pages/new-bulletin";
import nextService from 'mcac/utils/next-service';
import sessionData from '../../helpers/payloads/sessionData';
import startApp from "mcac/tests/helpers/start-app";
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';
import { test } from 'qunit';
import moduleForAcceptance from 'mcac/tests/helpers/module-for-acceptance'

let application;

moduleForAcceptance('Acceptance | bulletins/new', {
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

  const bulletin = {
    name: "New Bulletin",
    publishedAt: "05/27/1984 9:30 AM",
    description: "New bulletin description",
    serviceOrder: "New service order"
  };

  const sermon = {
    name: "My Sermon",
    notes: "",
    series: "Super series",
    speaker: "Mr. Speaker"
  };

  page.
    visit({ groupSlug: group.slug }).
    fillName(bulletin.name).
    fillPublishedAt(bulletin.publishedAt).
    fillServiceOrder(bulletin.serviceOrder);

  page.sermonEditor.
    fillName(sermon.name).
    fillNotes(sermon.notes).
    fillSeries(sermon.series).
    fillSpeaker(sermon.speaker);

  page.submit();

  andThen(() => {
    const bulletins = server.db.bulletins;
    const createdBulletin = bulletins[bulletins.length - 1];

    assert.equal(createdBulletin.name, bulletin.name);
    equalDate(assert, createdBulletin.publishedAt, bulletin.publishedAt);
    assert.equal(createdBulletin.serviceOrder, bulletin.serviceOrder);
    assert.equal(currentURL(), "/dashboard");
  });
});

test("it populates default values", assert => {
  authenticateSession(application, sessionData);

  const group = server.create("group");
  const lastWeekBulletin = server.create("bulletin", { group });

  page.visit({ groupSlug: group.slug });

  andThen(() => {
    assert.equal(page.name, "Sunday Worship Service");
    equalDate(assert, page.publishedAt, nextService());
    assert.equal(page.serviceOrder, lastWeekBulletin.serviceOrder);
  });
});

function equalDate(assert, actual, expected) {
  assert.equal(window.moment(actual).toDate().getTime(),
               window.moment(expected).toDate().getTime());
}
