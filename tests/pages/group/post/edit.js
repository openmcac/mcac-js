import { create, visitable, fillable, value, selectable, clickable } from 'ember-cli-page-object';

export default create({
  visit: visitable('/:groupSlug/:year/:month/:day/:postId/:slug/edit'),
  fillInTitle: fillable(selector("title")),
  fillInContent: fillable(selector("content")),
  fillInTags: fillable(selector("tags")),
  selectKind: selectable(selector("kind")),
  title: value(selector("title")),
  content: value(selector("content")),
  kind: value(selector("kind")),
  bannerUrl() {
    return imageUrl("canvas");
  },
  tags() {
    return find(`${selector("tags")}`).val().split(",").map(s => s.trim());
  },
  save: clickable(selector("save"))
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
