//     Backbone State 0.0.1
//
//     by Ian Storm Taylor
//     https://github.com/ianstormtaylor/backbone-state

;(function (_, Backbone) {
  if (_ === undefined) throw new Error('Couldn\'t find Underscore');
  if (Backbone === undefined) throw new Error('Couldn\'t find Backbone');

  Backbone.mixin || (Backbone.mixin = {});
  Backbone.mixin.state = function (Class) {

    // Augmented `_configure` to call `_configureStates`.
    var _configure = this.prototype._configure;
    if (this.prototype._previousAttributes || this.prototype._prepareModel) {
      this.prototype._configure = function (arg, options) {
        _configure.apply(this, arguments);
        this._configureStates(this.states || [], options || {});
      };
    } else {
      this.prototype._configure = function (options) {
        _configure.apply(this, arguments);
        this._configureStates(this.states || [], this.options || {});
      };
    }

    // Setup `this.state` to store state values, and grab apply any initial
    // state values passed in as options.
    this.prototype._configureStates = function (states, options) {
      this.state = {};
      for (var i = 0, state; state = states[i]; i++) {
        this.state[state] = options[state] === true;
      }
    };


    // Getters + Setters
    // ------

    // Retrive the view's current state.
    this.prototype.getState = function (state) {
      return this.state[state];
    };

    // Sets a view's state and tries to update its `$el`'s classes/attributes
    // with the jQuery-State plugin if it's available. Triggers two events, so
    // that you can either listen for `change:state` and receive the state's
    // name and value or for `change:state:hidden` and just receive its value.
    this.prototype.setState = function (state, value) {
      if (this.state[state] === value) return this;
      this.state[state] = value;
      if (this.$el && this.$el.state) this.$el.state(state, value);
      this.trigger('change:state:'+state, this, value);
      this.trigger('change:state', this, state, value);
    };

    // Shortcut for toggling a view's state.
    this.prototype.toggleState = function (state, toggle) {
      return this.setState(state, !this.getState(state));
    };


    // Helpers
    // -------

    // Bind to whenever an view's state changes to a particular boolean value.
    this.prototype.onState = function (state, value, callback, context) {
      // Callback right away if its in the right state already.
      var current = this.getState(state);
      if (current === value) callback.call(context, this, current);

      this.on('change:state:'+state, function (view, stateValue) {
        if (stateValue === value) callback.apply(context, arguments);
      });
      return this;
    };

    // Same as `onState`, but only ever fires the callback once.
    this.prototype.onceState = function (state, value, callback, context) {
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
    };
  };
}(_, Backbone));