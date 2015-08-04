import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'mcac/tests/helpers/start-app';

export default {
  visit: function() {
    visit("/groups/new");
    return this;
  },
  slug: function() {
    if (arguments.length > 0) {
      fillIn(".slug", arguments[0]);
      return this;
    }

    return find(".slug").val();
  },
  name: function() {
    if (arguments.length > 0) {
      fillIn(".name", arguments[0]);
      return this;
    }

    return find(".name").val();
  },
  about: function() {
    if (arguments.length > 0) {
      fillIn(".about", arguments[0]);
      return this;
    }

    return find(".about").val();
  },
  submit: function() {
    click(":submit");
    return this;
  }
};
