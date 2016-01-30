import PageObject from "../page-object";

export default class BasePageObject extends PageObject {
  toSelector(rawSelector) {
    return `[data-auto-id="${rawSelector}"]`;
  }
  assertHasValue(rawSelector = "", value = "", message = "") {
    return this._assertHasValue(rawSelector, value, true, message);
  }
  assertEqualDate(actual, expected, message = "") {
    return this.andThen(() => {
      this.assert.equal(window.moment(actual).toDate().getTime(),
                        window.moment(expected).toDate().getTime());
    });
  }
  _assertHasValue(rawSelector, value, bool, message = '') {
    return this.andThen(() => {
      message = message || `element with selector: '${this.toSelector(rawSelector)}' containing value: '${value}' ${bool ? 'was found' : 'was not found'}`;
      const elementValue = this.find(rawSelector).val();
      const hasValue = elementValue.indexOf(value.toString()) > -1;

      this.assert.equal(hasValue, bool, message);
    });
  }
}
