import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('group', 'Group', {
  // Specify the other units that are required for this test.
  needs: ['model:bulletin', 'model:announcement']
});

test('it stores the expected attributes', function(assert) {
  assert.expect(4);

  var model = this.subject({
    name: 'Test Group',
    slug: 'test-group',
    about: "Hello world!",
    bannerUrl: "http://test.example.com",
  });

  assert.equal(model.get('name'), 'Test Group');
  assert.equal(model.get('slug'), 'test-group');
  assert.equal(model.get('about'), "Hello world!");
  assert.equal(model.get('bannerUrl'), "http://test.example.com");
});
