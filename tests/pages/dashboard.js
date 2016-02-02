import PageObject from '../page-object';

const { clickable, visitable, text, collection } = PageObject;

const BULLETIN_SELECTOR =
  "*[data-auto-id='dashboard-bulletins'] *[data-auto-id='dashboard-bulletin']";

export default PageObject.create({
  visit: visitable("/dashboard"),
  bulletins: collection({
    itemScope: BULLETIN_SELECTOR,
    item: {
      name: text(bulletinSelector("name")),
      publishedAt: text(bulletinSelector("published-at"))
    }
  })
});

function bulletinSelector(s) {
  return `*[data-auto-id='dashboard-bulletin-${s}']`;
}

function selector(s) {
  return `*[data-auto-id='dashboard-${s}']`;
}
