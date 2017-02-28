import { create, visitable, fillable, value } from 'ember-cli-page-object';

export default create({
  visit: visitable('/:groupSlug/:year/:month/:day/:postId/:slug/edit'),
  fillInTitle: fillable(selector("title")),
  title: value(selector("title")),
  content: value(selector("content")),
  kind: value(selector("kind")),
  bannerUrl() {
    return imageUrl("canvas");
  },
  tags() {
    return find(`${selector("tags")}`).val().split(",").map(s => s.trim());
  }
});

function selector(s) {
  return `*[data-auto-id="post-form"] *[data-auto-id="${s}"]`;
}

function imageUrl(elementSelector) {
  const backgroundImageStyle = find(`${selector(elementSelector)}`).
    css("background-image").
    replace(/['"]+/g, '');

  return backgroundImageStyle.substring(4, backgroundImageStyle.length - 1);
}
