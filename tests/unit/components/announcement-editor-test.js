import Ember from 'ember';
import {
  moduleForComponent,
  test
} from 'ember-qunit';
import startApp from '../../helpers/start-app';

var application;

moduleForComponent('announcement-editor', 'AnnouncementEditorComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('it sends the correct actions when buttons are clicked', function(assert) {
  assert.expect(2);

  var component = this.subject(),
      $component = this.append(),
      targetObject = {
        add: function(index) {
          // it sends 'add-announcement' action with 0-based index
          assert.equal(index, 1);
        },
        remove: function(index) {
          // it sends 'remove-announcement' action with 0-based index
          assert.equal(index, 0);
        }
      };

  Ember.run(function() {
    component.set('position', 1);
    component.set('description', 'this is a description');
    component.set('targetObject', targetObject);
    component.set('add-announcement', 'add');
    component.set('remove-announcement', 'remove');
  });

  click('.add-announcement');
  click('.remove-announcement');
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  assert.equal(component._state, 'inDOM');
});
