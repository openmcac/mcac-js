import Ember from 'ember';

import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('markdown-textarea', 'MarkdownTextareaComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject();

  equal(component._state, 'preRender');

  // appends the component to the page
  this.append();

  equal(component._state, 'inDOM');
});

test('it renders markdown editor on DOM element', function() {
  expect(1);

  var component = this.subject();

  var renderEditorFn = component.renderEditor;
  component.renderEditor = function() {
    var $element = this.$();
    $element.markdown = function() {
      ok('markdown editor is rendered on dom element');
    };

    this.$ = function() {
      return $element;
    };

    renderEditorFn.apply(this);
  };

  // appends the component to the page
  this.append();
});

test('it sets the correct attributes', function() {
  expect(2);
  var component = this.subject();
  ok(component.attributeBindings.indexOf('data-provide') > -1);
  ok(component.classNames.indexOf('markdown-textarea') > -1);
});
