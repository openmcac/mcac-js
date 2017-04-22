import ENV from "mcac/config/environment";
import Ember from "ember";

export default function(group, post, router) {
  const path = router.generate("group.post.index", post);
  const canonicalUrl = `${ENV["DOMAIN"]}${path}`;

  const bannerUrl = Ember.isEmpty(post.get("bannerUrl")) ?
    "https://mcac.s3.amazonaws.com/bulletins/3e22317c-3b06-40d1-82c9-3c8a0ef2c41c." :
    `https://res.cloudinary.com/${ENV["CLOUDINARY_CLOUD_NAME"]}/image/fetch/w_1200/${post.get("bannerUrl")}`;

  const title = Ember.isEmpty(post.get("title")) ?  "Post" : post.get("title");

  return [
    {
      type: 'meta',
      tagId: 'meta-og-title',
      attrs: {
        property: 'og:title',
        content: `${title} | ${group.get("name")}`
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-image',
      attrs: {
        property: 'og:image',
        content: bannerUrl
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-url',
      attrs: {
        property: 'og:url',
        content: canonicalUrl
      }
    }, {
      type: 'link',
      tagId: 'link-canonical',
      attrs: {
        rel: 'canonical',
        href: canonicalUrl
      }
    }
  ];
}
