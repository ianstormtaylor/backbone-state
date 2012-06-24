//     Backbone State 0.0.1
//
//     by Ian Storm Taylor
//     https://github.com/ianstormtaylor/backbone-state

;(function (Backbone) {
/*global Backbone, _ */

// Extending the original Backbone.View to support inheritance.
var _View = Backbone.View;
Backbone.View = _View.extend({

  // Augmented `_configure` to setup `this.state` to hold the states defined in `this.states`, and retrieve initial state values from `this.options`.
  _configure : function (options) {
    _View.prototype._configure.apply(this, arguments);
    this._configureStates(this.states || [], options);
  },

  // Setup `this.state` to store state values, and grab apply any initial state values passed in as options.
  _configureStates : function (states, options) {
    this.state = {};
    for (var i = 0, state; state = states[i]; i++) {
      this.state[state] = options[state] === true;
    }
  },


  // States
  // ------

  // The states array holds the names of states you want to enable on your view. There are any defined by default, but yours might look like this:
  //
  //     states : [
  //         'disabled',
  //         'hidden',
  //         'rendered'
  //     ],
  states : [],


  // Getters + Setters
  // ------

  // Retrive the view's current state.
  getState : function (state) {
    return this.state[state];
  },

  // Sets a view's state and tries to update its `$el`'s classes/attributes with the jQuery-State plugin if it's available.
  setState : function (state, value) {
    // Don't do anything if we're already in the right state.
    if (this.state[state] === value) return this;

    this.state[state] = value;

    // If jQuery-State plugin: use it to reflect the state in the DOM.
    if (this.$el.state) this.$el.state(state, value);

    // Trigger two events, so that you can either listen for `change:state` and receive the state's name and value or listen for `change:state:hidden` and just receive its value.
    this.trigger('change:state:'+state, this, value);
    this.trigger('change:state', this, state, value);
  },

  // Shortcut for toggling a view's state.
  toggleState : function (state, toggle) {
    if (toggle !== undefined) return this.setState(state, toggle);
    else return this.setState(state, !this.getState(state));
  },


  // Helpers
  // -------

  // Bind to whenever an view's state changes to a particular boolean value.
  onState : function (state, value, callback, context) {
    // Callback right away if its in the right state already.
    var current = this.getState(state);
    if (current === value) callback.call(context, this, current);

    this.on('change:state:'+state, function (view, stateValue) {
      if (stateValue === value) callback.apply(context, arguments);
    });
    return this;
  },

  // Same as `onState`, but only ever fires the callback once.
  onceState : function (state, value, callback, context) {
    // Callback right away if its in the right state already.
    var current = this.getState(state);
    if (current === value) {
      callback.call(context, this, current);
      return this;
    }

    var self = this;
    var onceCallback = function (self, stateValue) {
      self.off('change:state:'+state, onceCallback, context);
      if (stateValue === value) callback.apply(context, arguments);
    };
    this.on('change:state:'+state, onceCallback, context);
    return this;
  }

});

}(Backbone));