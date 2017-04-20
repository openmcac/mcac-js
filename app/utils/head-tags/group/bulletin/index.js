import ENV from "mcac/config/environment";

export default function(group, bulletin) {
  const canonicalUrl =
    `${ENV["DOMAIN"]}/${group.get("slug")}/bulletins/${bulletin.get("id")}`;

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
    tagId: 'meta-og-image',
    attrs: {
      property: 'og:image',
      content: `https://res.cloudinary.com/${ENV["CLOUDINARY_CLOUD_NAME"]}/image/fetch/w_1200/${bulletin.get("bannerUrl")}`
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
}
