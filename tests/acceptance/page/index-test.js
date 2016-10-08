import Ember from "ember";
import page from "mcac/tests/pages/page-index";
import startApp from "mcac/tests/helpers/start-app";
import { test } from 'qunit';
import moduleForAcceptance from 'mcac/tests/helpers/module-for-acceptance'

let application;

moduleForAcceptance('Acceptance | PageIndex', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test("it renders the specified page", assert => {
  const group = server.create("group");
  const p = server.create("post", { kind: "page", group });

  page.visit({ groupSlug: group.slug, slug: p.slug });

  andThen(() => {
    assert.equal(currentURL(), `/${group.slug}/${p.slug}`);
    assert.equal(page.page.title, p.title);
    assert.equal(page.page.content.replace(/\s/g, ''),
                 p.content.replace(/\s/g, ''));
  });
});
