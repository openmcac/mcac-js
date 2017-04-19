export default function(group) {
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
      content: `https://res.cloudinary.com/fisherhall/image/fetch/w_1200,h_630,c_pad,b_white/${group.get("bannerUrl")}`
    }
  }];
};
