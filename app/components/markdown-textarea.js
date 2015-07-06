import Ember from 'ember';

export default Ember.TextArea.extend({
  attributeBindings: ['data-provide'],
  classNames: ['markdown-textarea'],
  renderEditor: Ember.on('didInsertElement', function() {
    this.$().markdown();
  })
});
