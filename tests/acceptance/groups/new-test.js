import Ember from "ember";
import { module, test } from "qunit";
import startApp from "mcac/tests/helpers/start-app";
import NewGroupPage from "mcac/tests/helpers/pages/groups/new";
import mockServer from 'mcac/tests/helpers/server';
import GroupPayload from 'mcac/tests/helpers/payloads/group';

var application, server;

module('Acceptance | groups/new', {
  beforeEach: function() {
    application = startApp();
    server = mockServer();
  },

  afterEach: function() {
    server.shutdown();
    Ember.run(application, 'destroy');
  }
});

function mockGroup(groupId, group) {
  server.get(`/api/v1/groups/${groupId}`, function(request) {
    let response = {
      "data": GroupPayload.build(groupId, group)
    };

    return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
  });
}

test('visiting /groups/new', function(assert) {
  authenticateSession();
  NewGroupPage.visit().
    name("New Group").
    slug("this-is-a-slug").
    about("This is a description about the group");

  andThen(function() {
    assert.equal(currentURL(), "/groups/new");
    assert.equal(NewGroupPage.slug(), "this-is-a-slug");
    assert.equal(NewGroupPage.name(), "New Group");
    assert.equal(NewGroupPage.about(), "This is a description about the group");
  });
});

test("creating a group", function(assert) {
  authenticateSession();
  let createdGroup;

  server.post("/api/v1/groups", function(request) {
    let requestBody = JSON.parse(request.requestBody);
    createdGroup = {
      "data": GroupPayload.build("2", requestBody.data.attributes)
    };

    mockGroup("2", requestBody.data.attributes);

    return [
      201,
      {"Content-Type": "application/vnd.api+json"},
      JSON.stringify(createdGroup)
    ];
  });

  NewGroupPage.visit().
    name("New Group").
    slug("this-is-a-slug").
    about("This is a description about the group").
    submit();

  andThen(function() {
    assert.equal(createdGroup.data.attributes.name, "New Group");
  });
});

test('Requires authentication', function(assert) {
  visit('/groups/new');

  andThen(function() {
    assert.equal(currentURL(), '/login');
  });
});
