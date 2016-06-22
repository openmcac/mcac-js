import PageObject from '../../page-object';

const { text } = PageObject;

export default {
  title: text(selector("title")),
  content: text(selector("content")),
  bannerUrl() {
    return imageUrl("page-view-banner");
  },
  publishedAt: text(selector("published-at")),
  hasBanner() {
    return find(selector("page-view-banner")).length > 0;
  }
};

function selector(s) {
  return `*[data-auto-id="page-view"] *[data-auto-id="${s}"]`;
}

function imageUrl(elementSelector) {
  const backgroundImageStyle = find(`${selector(elementSelector)}`).
    css("background-image").
    replace(/['"]+/g, '');

  return backgroundImageStyle.substring(4, backgroundImageStyle.length - 1);
}
