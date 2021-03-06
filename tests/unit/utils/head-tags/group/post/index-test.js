import { module, test } from 'qunit';
import headTags from 'mcac/utils/head-tags/group/post/index';
import Ember from 'ember';
import ENV from "mcac/config/environment";

module('Unit | Utility | head tags/group/post/index');

test("it populates opengraph tags", function(assert) {
  const post = Ember.Object.create({
    id: 123,
    title: "My Post",
    bannerUrl: "https://example.com/banner.jpg"
  });

  const group = Ember.Object.create({
    slug: "random-group",
    name: "Random Group"
  });

  const actualTags = headTags(group, post, stubRouter(assert));

  const expectedTags = [{
    type: 'meta',
    tagId: 'meta-og-title',
    attrs: {
      property: 'og:title',
      content: 'My Post | Random Group'
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
      content: `${ENV["DOMAIN"]}/stubbed-post-route`
    }
  }, {
    type: 'link',
    tagId: 'link-canonical',
    attrs: {
      rel: 'canonical',
      href: `${ENV["DOMAIN"]}/stubbed-post-route`
    }
  }];

  assert.deepEqual(actualTags, expectedTags);
});

test("without a banner", function(assert) {
  const post = Ember.Object.create({
    id: 123,
    title: "My Post"
  });

  const group = Ember.Object.create({
    slug: "random-group",
    name: "Random Group"
  });

  const ogImage = headTags(group, post, stubRouter(assert))
    .filter(t => t.tagId === "meta-og-image")[0];

  assert.equal(
    ogImage.attrs.content,
    "https://mcac.s3.amazonaws.com/bulletins/3e22317c-3b06-40d1-82c9-3c8a0ef2c41c."
  );
});

function stubRouter(assert) {
  return {
    generate(route, post) {
      assert.equal(route, "group.post.index");
      assert.equal(post.get("id"), 123);

      return "/stubbed-post-route";
    }
  }
}
