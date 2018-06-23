const path = require("path");
const chai = require("chai");
const expect = require("chai").expect;
const sinon = require('sinon');

chai.should();

const Events = require(path.join(__dirname, "..", "public", "js", "events.js")).default;

describe("Events Emitter class", () => {
    let events;

    beforeEach(() => {
        events = new Events();
    });

    describe("addEvent() method", () => {
        it("adds the specified events", () => {
            events.addEvent("testEvent");

            events._events.should.be.deep.equal({"testEvent": []});
        });

        it("throws error if event already exists", () => {
            events.addEvent("testEvent");
            expect(events.addEvent.bind(events, "testEvent")).to.throw(Error);
        });

        it("throws error if provided event name is not a string", () => {
            expect(events.addEvent.bind(events, function () {
            })).to.throw(Error);
            expect(events.addEvent.bind(events, 5)).to.throw(Error);
            expect(events.addEvent.bind(events, false)).to.throw(Error);
            expect(events.addEvent.bind(events, null)).to.throw(Error);
            expect(events.addEvent.bind(events)).to.throw(Error);
        });
    });

    describe("events member (getter method)", () => {
        it("returns the list of the events", () => {
            events.addEvent("event1");
            events.addEvent("event2");
            events.addEvent("event3");

            events.events.should.be.deep.equal(["event1", "event2", "event3"]);
        });
    });

    describe("on() method", () => {
        beforeEach(() => {
            events.addEvent("testEvent");
        });
        it("throws error when listener attached to unknown event", () => {
            expect(events.on.bind(events, "unknownEvent", () => {
            })).to.throw(Error);
        });

        it("throws error when listener is not specified", () => {
            expect(events.on.bind(events, "testEvent")).to.throw(Error);
        });

        it("attaches the event listener", () => {
            const listener = () => {

            };
            events.on("testEvent", listener);

            events._events.testEvent.should.have.length(1);
            events._events.testEvent[0].should.be.equal(listener);
        });
    });

    describe("off() method", () => {
        let listener = () => {

        };
        let warn;
        beforeEach(() => {
            events.addEvent("testEvent");
            events.on("testEvent", listener);

            warn = sinon.stub(console, "warn");
        });

        afterEach(() => {
            warn.restore();
        });

        it("throws error when the provided event does not exists", () => {
            expect(events.off.bind(events, "unknownEvent", listener)).to.throw(Error);
        });

        it("prints warning message when listener is not attached to event or its not specified", () => {
            events.off("testEvent", () => {
            });
            events.off("testEvent");
            expect(console.warn.called).to.be.equal(true);
        });

        it("removes the specified event listener", () => {
            events.off("testEvent", listener);

            events._events.testEvent.indexOf(listener).should.be.equal(-1);
        });
    });

    describe("trigger() method", () => {
        let listener1, listener2, warn;

        beforeEach(() => {
            events.addEvent("testEvent");

            events.on("testEvent", () => {
            });
            events.on("testEvent", () => {
            });

            listener1 = sinon.stub(events._events.testEvent, [0]);
            listener2 = sinon.spy(events._events.testEvent, [1]);

            warn = sinon.stub(console, "warn");
        });

        afterEach(() => {
            listener1.restore();
            listener2.restore();
            warn.restore();
        });

        it("throws error when triggering unknown event", () => {
            expect(events.trigger.bind(events, "unknownEvent")).to.throw(Error);
        });

        it("print waring message when triggering event without event listeners", () => {
            events.addEvent("eventWithoutListeners");
            events.trigger("eventWithoutListeners");
            expect(console.warn.called).to.be.equal(true);
        });

        it("triggers the event (calls all the event handlers)", () => {
            events.trigger("testEvent");
            expect(listener1.called).to.be.equal(true);
            expect(listener2.called).to.be.equal(true);
        });

        it("calls the event listeners with the provided payload", () => {
            events.trigger("testEvent", "param1");
            expect(listener2.getCall(0).args).to.be.deep.equal(["param1"]);
        });

    });
});