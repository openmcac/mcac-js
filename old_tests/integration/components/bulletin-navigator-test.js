import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bulletin-navigator', 'Integration | Component | bulletin navigator', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{bulletin-navigator}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#bulletin-navigator}}
      template block text
    {{/bulletin-navigator}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
