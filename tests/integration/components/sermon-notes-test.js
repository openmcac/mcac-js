import PageObject from "../../page-object";
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import component from "mcac/tests/pages/components/sermon-notes";

let page;

moduleForComponent('sermon-notes', 'Integration | Component | sermon notes', {
  integration: true,
  beforeEach: () => page = PageObject.create(component),
  afterEach: () => page.removeContext()
});

test('with sermon notes', function(assert) {
  page.setContext(this).
    render(hbs`{{sermon-notes notes="<div id='test'>hello world</div>"}}`);

  assert.equal(page.title, "Notes");
  assert.equal(page.notes, "hello world");
  assert.notOk(page.noNotesIndicatorShown());
});

test('without sermon notes', function(assert) {
  page.setContext(this).render(hbs`{{sermon-notes}}`);

  assert.equal(page.title, "Notes");
  assert.ok(page.noNotesIndicatorShown());
});
