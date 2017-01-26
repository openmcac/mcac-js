export default () => ({
  visit: function(groupSlug, bulletinId) {
    visit(`/${groupSlug}/bulletins/${bulletinId}/edit`);
    return this;
  },
  name: getOrSetSelectorFn("*[data-test-id='name'] input"),
  publishedAt: getOrSetSelectorFn("*[data-test-id='published-at'] input"),
  description: getOrSetSelectorFn("*[data-test-id='description'] input"),
  serviceOrder: getOrSetSelectorFn("*[data-test-id='service-order'] textarea"),
  sermonNotes: getOrSetSelectorFn("*[data-test-id='sermon-notes'] textarea"),
  submit: function() {
    click(bulletinFormSelectorPrefix(":submit"));
    return this;
  }
});

function getOrSetSelectorFn(selector) {
  return function() {
    selector = bulletinFormSelectorPrefix(selector);

    if (arguments.length > 0) {
      fillIn(selector, arguments[0]);
      return this;
    }

    return find(selector).val();
  };
}

function bulletinFormSelectorPrefix(selector) {
  return `*[data-test-id='bulletin-form'] ${selector}`;
}
