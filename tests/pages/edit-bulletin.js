import PageObject from '../page-object';

const { visitable, fillable, clickable, collection } = PageObject;

export default PageObject.create({
  visit: visitable("/:groupSlug/bulletins/:bulletinId/edit"),
  fillName: fillable(selector("name")),
  fillPublishedAt: fillable(`${selector("published-at")} input`),
  fillDescription: fillable(selector("description")),
  fillServiceOrder: fillable(selector("service-order")),
  fillSermonNotes: fillable(selector("sermon-notes")),
  submit: clickable('button[type=submit]'),
  name: PageObject.value(selector("name")),
  description: PageObject.value(selector("description")),
  publishedAt: PageObject.value(`${selector("published-at")} input`),
  serviceOrder: PageObject.value(selector("service-order")),
  sermonNotes: PageObject.value(selector("sermon-notes")),
  bannerUrl() {
    const backgroundImageStyle = find(`${selector("banner-preview")} .preview`).
      css("background-image").
      replace(/['"]+/g, '');

    return backgroundImageStyle.substring(4, backgroundImageStyle.length - 1);
  },
  audioUrl() {
    return find(`${selector("audio-preview")} *[data-auto-id='preview']`).
      attr("href");
  },
  announcements: collection({
    itemScope: "*[data-auto-id='announcements-editor'] *[data-auto-id='announcement-editor']",
    item: {
      url: PageObject.value("*[data-auto-id='announcement-url']"),
      description: PageObject.value("*[data-auto-id='announcement-description']")
    }
  })
});

function selector(s) {
  return `*[data-auto-id='bulletin-${s}']`;
}
