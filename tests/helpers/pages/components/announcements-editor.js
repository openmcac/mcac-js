export default () => ({
  size: function() {
    return find(selectorPrefix("*[data-test-id='announcement-editor']")).size();
  }
});

function getOrSetSelectorFn(selector) {
  return function() {
    selector = selectorPrefix(selector);

    if (arguments.length > 0) {
      fillIn(selector, arguments[0]);
      return this;
    }

    return find(selector).val();
  };
}

function selectorPrefix(selector) {
  return `*[data-test-id='announcements-editor'] ${selector}`;
}
