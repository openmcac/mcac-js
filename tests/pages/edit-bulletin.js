import PageObject from '../page-object';
import sermonEditor from "mcac/tests/pages/components/sermon-editor";

const { visitable, fillable, clickable, collection } = PageObject;

export default PageObject.create({
  visit: visitable("/:groupSlug/bulletins/:bulletinId/edit"),
  fillName: fillable(selector("name")),
  fillPublishedAt: fillable(`${selector("published-at")} input`),
  fillServiceOrder: fillable(selector("service-order")),
  submit: clickable('button[type=submit]'),
  sermon: sermonEditor,
  name: PageObject.value(selector("name")),
  publishedAt: PageObject.value(`${selector("published-at")} input`),
  serviceOrder: PageObject.value(selector("service-order")),
  bannerUrl() {
    const backgroundImageStyle = find(`${selector("banner-preview")} .preview`).
      css("background-image").
      replace(/['"]+/g, '');

    return backgroundImageStyle.substring(4, backgroundImageStyle.length - 1);
  },
  announcements: collection({
    itemScope: "*[data-auto-id='announcements-editor'] *[data-auto-id='announcement-editor']",
    item: {
      url: PageObject.value("*[data-auto-id='url']"),
      description: PageObject.value("*[data-auto-id='description']"),
      fillUrl: fillable("*[data-auto-id='url']"),
      fillDescription: fillable("*[data-auto-id='description']"),
      clickRemove: clickable("*[data-auto-id='remove']")
    }
  }),
  appendNewAnnouncement: clickable("*[data-auto-id='announcements-editor'] *[data-auto-id='append-announcement']")
});

function selector(s) {
  return `*[data-auto-id='bulletin-${s}']`;
}
