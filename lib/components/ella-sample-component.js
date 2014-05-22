import { Component, get, set } from 'ember';

/*
@module emberella
@submodule emberella-components
 */
var EllaSampleComponent;

EllaSampleComponent = {
  tagName: 'ella-sample',
  classNameBindings: ['activated'],
  click: function() {
    set(this, 'activated', !get(this, 'activated'));
    this.incrementProperty('tests');
  },
  activated: false,
  tests: 0
};

export default Component.extend(EllaSampleComponent);
