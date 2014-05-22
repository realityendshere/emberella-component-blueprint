import { Component, get, set, computed } from 'ember';

/*
@module emberella
@submodule emberella-components
 */
var EllaSampleComponent;

/*
  The `EllaSampleComponent` illustrates how to get started with Emberella
  Component Blueprint.

  @class EllaSampleComponent
  @namespace Emberella
  @extends Ember.Component
*/

EllaSampleComponent = {
  /*
    The type of element to render this view into. By default, samples will appear
    as `<ella-sample/>` elements.

    @property tagName
    @type String
    @default 'ella-sample'
  */
  tagName: 'ella-sample',

  /*
    HTML attributes that should be bound to this object's properties.

    @property attributeBindings
    @type Array
    @default ['_activated:activated']
  */
  attributeBindings: ['_activated:activated'],

  click: function() {
    set(this, 'activated', !get(this, 'activated'));
    this.incrementProperty('tests');
  },

  activated: false,

  _activated: computed(function() {
    return get(this, 'activated') ? 'true' : null;
  }).property('activated').readOnly(),

  tests: 0
};

export default Component.extend(EllaSampleComponent);
