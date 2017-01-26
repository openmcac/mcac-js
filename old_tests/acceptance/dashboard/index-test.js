import Ember from "ember";
import page from "mcac/tests/pages/dashboard";
import sessionData from '../../helpers/payloads/sessionData';
import startApp from "mcac/tests/helpers/start-app";
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';
import { test } from 'qunit';
import moduleForAcceptance from 'mcac/tests/helpers/module-for-acceptance'

let application;

moduleForAcceptance('Acceptance | dashboard', {
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

  const group = server.create("group", { slug: "english-service" });
  const bulletins = server.createList("bulletin", 3, { group });

  page.visit();

  andThen(() => {
    assert.equal(page.createBulletinUrl, "/english-service/bulletins/new");

    bulletins.forEach((bulletin, i) => {
      assert.equal(page.bulletins(i).name, bulletins[i].name);
      equalDate(assert, page.bulletins(i).publishedAt, bulletins[i].publishedAt);
      assert.equal(page.bulletins(i).showUrl,
                   `/english-service/bulletins/${bulletins[i].id}`);
      assert.equal(page.bulletins(i).editUrl,
                   `/english-service/bulletins/${bulletins[i].id}/edit`);
    });

    assert.equal(currentURL(), "/dashboard");
  });
});

function equalDate(assert, actual, expected) {
  assert.equal(window.moment(actual).toDate().getTime(),
               window.moment(expected).toDate().getTime());
}
