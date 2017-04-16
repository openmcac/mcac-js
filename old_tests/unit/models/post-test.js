import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('post', {
  needs: ["model:group", "model:user"]
});

test('tags: contains an array of tag strings', function(assert) {
  var tags = ['tag1', 'tag2', 'tag3'];
  var model = this.subject({ tags: tags });

  assert.equal(model.get('tags'), tags);
});

test('tagList: returns the list of tags separated by commas', function(assert) {
  var tagList = 'tag1, tag2, tag3';
  var tags = ['tag1', 'tag2', 'tag3'];
  var model = this.subject({ tags: tags });

  assert.equal(model.get('tagList'), tagList);
});

test('tagList: set tags from a comma delimited string', function(assert) {
  var tagList = 'tag2, tag3, tag4';
  var tags = ['tag2', 'tag3', 'tag4'];
  var model = this.subject({ tags: ['random', 'tags'] });

  Ember.run(function() {
    model.set('tagList', tagList);
  });

  assert.deepEqual(model.get('tags'), tags);
});

test("contentHtml: converts markdown content into HTML", function(assert) {
  assert.expect(1);
  var content = "this is **markdown**";
  var contentHtml = "<p>this is <strong>markdown</strong></p>";
  var model = this.subject({ content: content });

  assert.equal(model.get("contentHtml").trim(), contentHtml);
});
