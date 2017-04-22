import { module, test } from 'qunit';
import headTags from 'mcac/utils/head-tags/group/bulletin/index';
import Ember from 'ember';
import ENV from "mcac/config/environment";

module('Unit | Utility | head tags/group/bulletin/index');

function stubRouter(assert) {
  return {
    generate(route, groupSlug, bulletin) {
      assert.equal(route, "group.bulletin.index");
      assert.equal(groupSlug, "random-group");
      assert.equal(bulletin.get("id"), 123);

      return `/${groupSlug}/bulletin/${bulletin.get("id")}`;
    }
  }
}

test("it populates opengraph tags", function(assert) {
  const bulletin = Ember.Object.create({
    id: 123,
    name: "My Bulletin",
    bannerUrl: "https://example.com/banner.jpg"
  });

  const group = Ember.Object.create({
    slug: "random-group"
  });

  const actualTags = headTags(group, bulletin, stubRouter(assert));

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
    tagId: 'meta-og-url',
    attrs: {
      property: 'og:url',
      content: `${ENV["DOMAIN"]}/random-group/bulletin/123`
    }
  }, {
    type: 'link',
    tagId: 'link-canonical',
    attrs: {
      rel: 'canonical',
      href: `${ENV["DOMAIN"]}/random-group/bulletin/123`
    }
  }, {
    type: 'meta',
    tagId: 'meta-og-image',
    attrs: {
      property: 'og:image',
      content: `https://res.cloudinary.com/${ENV["CLOUDINARY_CLOUD_NAME"]}/image/fetch/w_1200/https://example.com/banner.jpg`
    }
  }];

  assert.deepEqual(actualTags, expectedTags);
});

test("without a banner", function(assert) {
  const bulletin = Ember.Object.create({
    id: 123,
    name: "My Bulletin"
  });

  const group = Ember.Object.create({
    slug: "random-group"
  });

  const ogImage = headTags(group, bulletin, stubRouter(assert))
    .filter(t => t.tagId === "meta-og-image")[0];

  assert.equal(
    ogImage.attrs.content,
    "https://mcac.s3.amazonaws.com/bulletins/3e22317c-3b06-40d1-82c9-3c8a0ef2c41c."
  );
});
