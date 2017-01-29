import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('route:group.post', 'Unit | Route | group.post', {
  needs: ["service:router-scroll", "service:metrics"]
});

test('it exists', function(assert) {
  const route = this.subject();
  const post = Ember.Object.create({
    publishedAt: new Date(2000, 0, 2),
    id: 111,
    slug: "my-slug"
  });

  assert.deepEqual(route.serialize(post), {
    day: "02",
    month: "01",
    post_id: 111,
    slug: post.slug,
    year: 2000
  });
});
