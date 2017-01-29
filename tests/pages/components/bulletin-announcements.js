import PageObject from '../../page-object';

const { text, collection } = PageObject;

const ANNOUNCEMENT_LIST_SCOPE =
  "*[data-auto-id='bulletin-announcements'] *[data-auto-id='announcement']";

export default {
  title: text(selector("title")),
  announcements: collection({
    itemScope: ANNOUNCEMENT_LIST_SCOPE,
    item: {
      description: text("*[data-auto-id='description']")
    }
  }),
  noAnnouncementsIndicatorShown() {
    return $.find(selector("no-announcements")).length > 0;
  },
};

function selector(s) {
  return `*[data-auto-id="bulletin-announcements"] *[data-auto-id="${s}"]`;
}
