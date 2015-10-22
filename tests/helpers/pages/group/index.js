import Ember from 'ember';
import PageObject from "../../../page-object";
import { findElementWithAssert } from "../../../page-object/helpers";

let { clickable, fillable, text, visitable, collection, selectable } = PageObject;

export default function(slug) {
  return PageObject.build({
    visit: visitable(`/${slug}`),
    name: text("*[data-test-id='name']"),
    about: text("*[data-test-id='about']"),
    bannerUrl: function() {
      let backgroundImage =
        find("*[data-test-id='group-banner']")[0].style.backgroundImage;
      return backgroundImage.substring(4, backgroundImage.length - 1);
    },
    posts: collection({
      itemScope: "*[data-test-id='post']",
      item: {
        title: text("*[data-test-id='title']"),
        content: text("*[data-test-id='content']")
      }
    })
  });
};
