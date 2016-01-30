import Ember from 'ember';
import BSDatetimePickerComponent from 'ember-bootstrap-datetimepicker/components/bs-datetimepicker';

export default {
  name: "data-attribute",
  initialize() {
    const attributeName = "data-auto-id";

    Ember.TextField.reopen({
      attributeBindings: [attributeName]
    });

    Ember.LinkComponent.reopen({
      attributeBindings: [attributeName]
    });

    Ember.TextArea.reopen({
      attributeBindings: [attributeName]
    });

    BSDatetimePickerComponent.reopen({
      attributeBindings: [attributeName]
    });
  }
};
