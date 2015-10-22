import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import mockServer from '../helpers/server';
import BulletinPayload from '../helpers/payloads/bulletin';

let application, fakeServer;

module('Acceptance: SundayRedirect', {
  needs: ['model:bulletin', 'model:announcement'],
  beforeEach: function() {
    application = startApp();
    fakeServer = mockServer();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

function mockSunday(bulletin) {
  fakeServer.get("/api/v1/sunday", function(request) {
    var response = { "data": BulletinPayload.build(1, bulletin) };
    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(response)
    ];
  });

  fakeServer.get("/api/v1/bulletins/1", function(request) {
    var response = { "data": BulletinPayload.build(1, bulletin) };
    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(response)
    ];
  });

  fakeServer.get("/api/v1/bulletins/1/announcements", function(request) {
    return [
      200,
      {"Content-Type": "application/vnd.api+json"},
      JSON.stringify({ "data": [] })
    ];
  });
}

test('app/index.js redirects root path to /sunday', function(assert) {
  assert.expect(1);

  mockSunday({
    "audio-url": null,
    "banner-url": null,
    "description": "This is a service bulletin.",
    "name": "Sunday Service",
    "published-at": "2014-12-21T13:58:27-05:00",
    "sermon-notes": null,
    "service-order": "This is the service order."
  });

  visit('/');

  andThen(function() {
    Ember.run.next(function() {
      assert.equal(currentURL(), '/sunday');
    });
  });
});
