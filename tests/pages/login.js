import PageObject from '../page-object';

const { clickable, visitable, fillable } = PageObject;

export default PageObject.create({
  visit: visitable("/login"),
  fillEmail: fillable(selector("email")),
  fillPassword: fillable(selector("password")),
  submit: clickable("button[type=submit]")
});

function selector(s) {
  return `*[data-auto-id='login-${s}']`;
}
