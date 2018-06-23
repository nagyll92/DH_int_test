const path = require("path");
const chai = require("chai");

chai.should();

const Events = require(path.join(__dirname, "..", "public", "js", "events.js")).default;

describe("Events", ()=>{
    let events;

    beforeEach(()=>{
        events = new Events();
    });

    it('adds events', ()=>{
        events.addEvent("testEvent");

        events.events.should.be.deep.equal(["testEvent"]);
    });
});