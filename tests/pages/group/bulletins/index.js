import { create, visitable, collection, text, clickable } from 'ember-cli-page-object';

const BULLETIN_LIST_SCOPE =
  "*[data-auto-id='bulletins'] *[data-auto-id='bulletin']";


export default create({
  visit: visitable('/:group_slug/bulletins'),
  bulletins: collection({
    itemScope: BULLETIN_LIST_SCOPE,
    item: {
      name: text("*[data-auto-id='name']"),
      remove: clickable("*[data-auto-id='remove']")
    }
  })
});
