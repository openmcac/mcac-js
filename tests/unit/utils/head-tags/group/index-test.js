import headTags from 'mcac/utils/head-tags/group/index';
import { module, test } from 'qunit';
import Ember from 'ember';
import ENV from "mcac/config/environment";

module('Unit | Utility | head tags/group/index');

test("it populates opengraph tags", function(assert) {
  const group = Ember.Object.create({
    name: "My Group",
    shortDescription: "My short description",
    bannerUrl: "https://example.com/banner.jpg",
    slug: "test-group"
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
      content: `https://res.cloudinary.com/${ENV["CLOUDINARY_CLOUD_NAME"]}/image/fetch/w_1200,h_630,c_pad,b_white/https://example.com/banner.jpg`
    }
  }, {
    type: 'meta',
    tagId: 'meta-og-url',
    attrs: {
      property: 'og:url',
      content: `${ENV["DOMAIN"]}/test-group`
    }
  }, {
    type: 'link',
    tagId: 'link-canonical',
    attrs: {
      rel: 'canonical',
      href: `${ENV["DOMAIN"]}/test-group`
    }
  }];

  assert.deepEqual(actualTags, expectedTags);
});
