import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import page from "mcac/tests/pages/components/bulletin-cover";

moduleForComponent('bulletin-cover', 'Integration | Component | bulletin cover', {
  integration: true,
  afterEach: () => page.removeContext()
});

test('rendering a bulletin cover', function(assert) {
  this.set("bulletin", {
    publishedAt: new Date(),
    name: "Sunday Service",
    group: { slug: "english-service" }
  });

  page.setContext(this).
    render(hbs`{{bulletin-cover bulletin=bulletin}}`);

  assert.equal(page.publishedAt, "Notes");
});
