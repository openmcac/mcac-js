import Ember from 'ember';

export default Ember.TextArea.extend({
  attributeBindings: ['data-provide'],
  classNames: ['markdown-textarea'],
  renderEditor: function() {
    this.$().markdown();
  }.on('didInsertElement')
});
