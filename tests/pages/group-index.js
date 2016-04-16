import PageObject from '../page-object';

const { visitable, text } = PageObject;

export default PageObject.create({
  visit: visitable("/:slug"),
  shortDescription: text(selector("short-description")),
  meetDetails: text(selector("meet-details")),
  targetAudience: text(selector("target-audience")),
  name: text(selector("name")),
  bannerUrl() {
    return imageUrl("banner");
  },
  profilePictureUrl() {
    return imageUrl("profile-picture");
  },
});

function imageUrl(elementSelector) {
  const backgroundImageStyle = find(`${selector(elementSelector)}`).
    css("background-image").
    replace(/['"]+/g, '');

  return backgroundImageStyle.substring(4, backgroundImageStyle.length - 1);
}

function selector(s) {
  return `*[data-auto-id='group-${s}']`;
}

