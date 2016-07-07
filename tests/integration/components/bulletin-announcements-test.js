import PageObject from '../../page-object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import component from "mcac/tests/pages/components/bulletin-announcements";

let page;

moduleForComponent('bulletin-announcements', 'Integration | Component | bulletin announcements', {
  integration: true,
  beforeEach: () => { page = PageObject.create(component); },
  afterEach: () => page.removeContext()
});

test('with announcements', function(assert) {
  const announcements = [
    { descriptionHtml: "This is announcement 1" },
    { descriptionHtml: "This is announcement 2" },
    { descriptionHtml: "This is announcement 3" }
  ];

  this.set("announcements", announcements);

  page.setContext(this).
    render(hbs`{{bulletin-announcements announcements=announcements}}`);

  assert.equal(page.title, "Announcements");
  assert.equal(page.announcements(0).description, announcements[0].descriptionHtml);
  assert.notOk(page.noAnnouncementsIndicatorShown());
});

test('without announcements', function(assert) {
  this.set("announcements", []);

  page.setContext(this).
    render(hbs`{{bulletin-announcements announcements=announcements}}`);

  assert.ok(page.noAnnouncementsIndicatorShown());
});
