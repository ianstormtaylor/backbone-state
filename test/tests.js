/*global Backbone, _, sinon, suite, beforeEach, test, expect */

(function () {

    var StateView = Backbone.View.extend({
        states : ['rendered', 'disabled', 'hidden']
    });
    Backbone.mixin.state.apply(StateView);

    var StateModel = Backbone.Model.extend({
        states : ['synced']
    });
    Backbone.mixin.state.apply(StateModel);

    suite('backbone-state');
    beforeEach(function () {
        this.view = new StateView({
            disabled : true,
            hidden   : 'asd'
        });
        this.model = new StateModel({
            synced : true
        });
    });

    test('should apply initial state values from options', function () {
        expect(this.view._state.rendered).to.be.false;
        expect(this.view._state.disabled).to.be.true;
        expect(this.view._state.hidden).to.be.false;
    });

    test('should be able to get a states value', function () {
        expect(this.view._state.rendered).to.be.false;
        expect(this.view.state('rendered')).to.be.false;
        expect(this.view._state.disabled).to.be.true;
        expect(this.view.state('disabled')).to.be.true;
        expect(this.view._state.hidden).to.be.false;
        expect(this.view.state('hidden')).to.be.false;
    });

    test('should be able to set a states value', function () {
        expect(this.view.state('rendered')).to.be.false;
        this.view.state('rendered', true);
        expect(this.view.state('rendered')).to.be.true;
    });

    test('should use jQuery-State when setting if available', function () {
        expect(this.view.$el).not.to.have.class('hidden');
        this.view.state('hidden', true);
        expect(this.view.$el).to.have.class('hidden');
    });

    test('should be able to toggle a states value', function () {
        expect(this.view.state('rendered')).to.be.false;
        this.view.toggleState('rendered');
        expect(this.view.state('rendered')).to.be.true;
        this.view.toggleState('rendered');
        expect(this.view.state('rendered')).to.be.false;
    });

    test('should trigger two events when a state changes', function () {
        var triggerSpy = sinon.spy(this.view, 'trigger');
        this.view.state('disabled', true);
        expect(triggerSpy).not.to.have.been.called;
        this.view.state('disabled', false);
        expect(triggerSpy).to.have.been.calledTwice;
        expect(triggerSpy.firstCall.calledWith('change:state:disabled', this.view, false)).to.be.true;
        expect(triggerSpy.secondCall.calledWith('change:state', this.view, 'disabled', false)).to.be.true;
    });

    test('should be able to listen to a state change', function () {
        var handler = sinon.spy();
        this.view.onState('disabled', true, handler);
        expect(handler).to.have.been.calledOnce;
        this.view.toggleState('disabled');
        this.view.toggleState('disabled');
        expect(handler).to.have.been.calledTwice;
    });

    test('should be able to listen to a state change once', function () {
        var handler = sinon.spy();
        this.view.onceState('disabled', true, handler);
        expect(handler).to.have.been.calledOnce;
        this.view.toggleState('disabled');
        this.view.toggleState('disabled');
        expect(handler).to.have.been.calledOnce;
    });

}());