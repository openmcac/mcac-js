/* global $:false */

import PageObject from '../../page-object';

const { clickable } = PageObject;

export default PageObject.create({
  remove: clickable(selector("remove")),
  isHidden() {
    return $($.find("*[data-auto-id='image-preview']"));
  },
  url() {
    const backgroundImageStyle = $($.find(`${selector("canvas")}`)).
      css("background-image").
      replace(/['"]+/g, '');

    return backgroundImageStyle.substring(4, backgroundImageStyle.length - 1);
  }
});

function selector(s) {
  return `*[data-auto-id="image-preview"] *[data-auto-id='${s}']`;
}
