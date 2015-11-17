import { moduleForComponent, test } from 'ember-qunit';
import Post from "mcac/models/post";
import Group from "mcac/models/group";

moduleForComponent('post-view', 'Unit | Component | post view', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);

  let group = Group.createRecord({
    name: "English Service",
    slug: "english-service",
    about: "",
    bannerUrl: ""
  });

  let post = Post.createRecord({
    group: group,
    bannerUrl: "",
    content: "**Hello** world!",
    publishedAt: new Date(),
    slug: "test-post",
    title: "Test Post"
  });

  // Creates the component instance
  let component = this.subject({ post: post });
  assert.equal(component._state, 'preRender');

  // debugger;
  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
