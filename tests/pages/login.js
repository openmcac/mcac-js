import PageObject from '../page-object';

const { clickable, visitable } = PageObject;

export default PageObject.create({
  visit: visitable("/login")
});

function selector(s) {
  return `*[data-auto-id='login-${s}']`;
}
