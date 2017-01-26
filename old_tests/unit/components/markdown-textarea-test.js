import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('markdown-textarea', 'MarkdownTextareaComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();

  assert.equal(component._state, 'preRender');

  // appends the component to the page
  this.render();

  assert.equal(component._state, 'inDOM');
});

test('it renders markdown editor on DOM element', function(assert) {
  assert.expect(1);

  var component = this.subject();

  var renderEditorFn = component.renderEditor;
  component.renderEditor = function() {
    var $element = this.$();
    $element.markdown = function() {
      assert.ok('markdown editor is rendered on dom element');
    };

    this.$ = function() {
      return $element;
    };

    renderEditorFn.apply(this);
  };

  // appends the component to the page
  this.render();
});

test('it sets the correct attributes', function(assert) {
  assert.expect(2);
  var component = this.subject();
  assert.ok(component.attributeBindings.indexOf('data-provide') > -1);
  assert.ok(component.classNames.indexOf('markdown-textarea') > -1);
});
