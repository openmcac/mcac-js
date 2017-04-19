import headTags from 'mcac/utils/head-tags/group/index';
import { module, test } from 'qunit';
import Ember from 'ember';

module('Unit | Utility | head tags/group/index');

test("it populates opengraph tags", function(assert) {
  const group = Ember.Object.create({
    name: "My Group",
    shortDescription: "My short description",
    bannerUrl: "https://example.com/banner.jpg"
  });

  const actualTags = headTags(group);

  const expectedTags = [{
    type: 'meta',
    tagId: 'meta-og-title',
    attrs: {
      property: 'og:title',
      content: 'My Group | Montreal Chinese Alliance Church'
    }
  }, {
    type: 'meta',
    tagId: 'meta-og-description',
    attrs: {
      property: 'og:description',
      content: "My short description"
    }
  }, {
    type: 'meta',
    tagId: 'meta-og-image',
    attrs: {
      property: 'og:image',
      content: "https://res.cloudinary.com/fisherhall/image/fetch/w_1200,h_630,c_pad,b_white/https://example.com/banner.jpg"
    }
  }];

  assert.deepEqual(actualTags, expectedTags);
});
