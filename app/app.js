import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

Ember.TextArea.reopen({
  attributeBindings: ['data-provide'],
  didInsertElement: function() {
    Ember.$('textarea').each(function() {
      Ember.$(this).markdown();
    });
  }
});

export default App;
