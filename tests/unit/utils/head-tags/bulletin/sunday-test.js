import headTagsBulletinSunday from 'mcac/utils/head-tags/bulletin/sunday';
import { module, test } from 'qunit';
import headTags from 'mcac/utils/head-tags/bulletin/sunday';
import Ember from 'ember';
import ENV from "mcac/config/environment";

module('Unit | Utility | head tags/bulletin/sunday');

test("it populates opengraph tags", function(assert) {
  const bulletin = Ember.Object.create({
    id: 123,
    name: "My Bulletin",
    bannerUrl: "https://example.com/banner.jpg"
  });

  const actualTags = headTags(bulletin);

  const expectedTags = [{
    type: 'meta',
    tagId: 'meta-og-title',
    attrs: {
      property: 'og:title',
      content: 'My Bulletin | Montreal Chinese Alliance Church'
    }
  }, {
    type: 'meta',
    tagId: 'meta-og-description',
    attrs: {
      property: 'og:description',
      content: "Join us every Sunday at 9:30am!"
    }
  }, {
    type: 'meta',
    tagId: 'meta-og-image',
    attrs: {
      property: 'og:image',
      content: `https://res.cloudinary.com/${ENV["CLOUDINARY_CLOUD_NAME"]}/image/fetch/w_1200/https://example.com/banner.jpg`
    }
  }, {
    type: 'meta',
    tagId: 'meta-og-url',
    attrs: {
      property: 'og:url',
      content: `${ENV["DOMAIN"]}/english-service/bulletins/123`
    }
  }, {
    type: 'link',
    tagId: 'link-canonical',
    attrs: {
      rel: 'canonical',
      href: `${ENV["DOMAIN"]}/english-service/bulletins/123`
    }
  }];

  assert.deepEqual(actualTags, expectedTags);
});
