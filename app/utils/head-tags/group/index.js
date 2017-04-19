import ENV from "mcac/config/environment";

export default function(group) {
  const canonicalUrl = `${ENV["DOMAIN"]}/${group.get("slug")}`;

  return [{
    type: 'meta',
    tagId: 'meta-og-title',
    attrs: {
      property: 'og:title',
      content: `${group.get("name")} | Montreal Chinese Alliance Church`
    }
  }, {
    type: 'meta',
    tagId: 'meta-og-description',
    attrs: {
      property: 'og:description',
      content: `${group.get("shortDescription")}`
    }
  }, {
    type: 'meta',
    tagId: 'meta-og-image',
    attrs: {
      property: 'og:image',
      content: `https://res.cloudinary.com/${ENV["CLOUDINARY_CLOUD_NAME"]}/image/fetch/w_1200,h_630,c_pad,b_white/${group.get("bannerUrl")}`
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
  }];
};
