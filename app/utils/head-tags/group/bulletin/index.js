import ENV from "mcac/config/environment";
import Ember from "ember";

export default function(group, bulletin, router) {
  const path = router.generate("group.bulletin.index", group.get("slug"), bulletin);
  const canonicalUrl = `${ENV["DOMAIN"]}${path}`;
  const bannerUrl = Ember.isEmpty(bulletin.get("bannerUrl")) ?
    "https://mcac.s3.amazonaws.com/bulletins/3e22317c-3b06-40d1-82c9-3c8a0ef2c41c." :
    `https://res.cloudinary.com/${ENV["CLOUDINARY_CLOUD_NAME"]}/image/fetch/w_1200/${bulletin.get("bannerUrl")}`;

  return [{
    type: 'meta',
    tagId: 'meta-og-title',
    attrs: {
      property: 'og:title',
      content: `${bulletin.get("name")} | Montreal Chinese Alliance Church`
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
      content: canonicalUrl
    }
  }, {
    type: 'link',
    tagId: 'link-canonical',
    attrs: {
      rel: 'canonical',
      href: canonicalUrl
    }
  }, {
    type: 'meta',
    tagId: 'meta-og-image',
    attrs: {
      property: 'og:image',
      content: bannerUrl
    }
  }];
}
