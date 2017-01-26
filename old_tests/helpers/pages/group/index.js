import PageObject from "../../../page-object";

let { text, visitable, collection } = PageObject;
// let { clickable, fillable, text, visitable, collection, selectable } = PageObject;

export default function(slug) {
  return PageObject.create({
    visit: visitable(`/${slug}`),
    name: text("*[data-test-id='name']"),
    about: text("*[data-test-id='about']"),
    bannerUrl() {
      const backgroundImageStyle = find(selector("banner")).
        css("background-image").
        replace(/['"]+/g, '');

      return backgroundImageStyle.substring(4, backgroundImageStyle.length - 1);
    },
    posts: collection({
      itemScope: "*[data-test-id='post']",
      item: {
        title: text("*[data-test-id='title']"),
        content: text("*[data-test-id='content']")
      }
    })
  });
}

function selector(s) {
  return `*[data-auto-id='group-${s}']`;
}
