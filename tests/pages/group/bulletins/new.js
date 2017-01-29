import { create, visitable } from 'ember-cli-page-object';

export default create({
  visit: visitable('/:group_slug/bulletins/new')
});
