/**
 * An event emitter class
 * @class Events
 */
class Events {
    /**
     * @param {string[]} events A list of pre-defined events
     */
    constructor(events = []) {
        this._events = {};
        events.forEach(event => this.addEvent(event));
    }

    /**
     * Attach and event to make possible to trigger it and to listen to it.
     * @param {string} eventName Then name (and also the id) of the event
     */
    addEvent(eventName) {
        if (typeof eventName !== "string")
            throw new TypeError("The eventName should be a string");

        if (typeof this._events[eventName] !== "undefined")
            throw new Error(`The event '${eventName}' is already defined.`);

        this._events[eventName] = [];
    }

    /**
     * Getter function returns the list of attached events
     * @return {string[]} the list of events
     */
    get events() {
        return Object.keys(this._events);
    }

    /**
     * Attaches the event listener to the specified event
     * @param {string} eventName the name of the event
     * @param {Function} listener the function to be called when the event is triggered
     */
    on(eventName, listener) {
        if (typeof this._events[eventName] === "undefined")
            throw new Error(`Unknown event '${eventName}'. Use 'addEvent' method to create the event before attaching any listener to it!`);

        if (typeof listener !== "function")
            throw new TypeError(`The event listener (assigned to '${eventName}') must be a function...`);

        this._events[eventName].push(listener);

    }

    /**
     * Removes the event listener from the specified event
     * @param {string} eventName the name of the event
     * @param {Function} listener the listener function to be removed
     */
    off(eventName, listener) {
        if (typeof this._events[eventName] === "undefined")
            throw new Error(`Unknown event '${eventName}'.`);

        if (this._events[eventName].indexOf(listener) < 0)
            console.warn(`Trying to remove unassigned listener from event '${eventName}'...`);

        this._events[eventName] = this._events[eventName].filter(l => l !== listener);

    }

    /**
     * Fires the selected items using the specified payload
     * @param {string} eventName the name of the event to be fired
     * @param {*} payload the payload of the event
     */
    trigger(eventName, payload) {
        if (typeof this._events[eventName] === "undefined")
            throw new Error(`Unknown event '${eventName}'.`);

        if (this._events[eventName].length === 0)
            console.warn(`Event '${eventName}' triggered without any listener...`);

        this._events[eventName].forEach(listener => {
            listener(payload);
        });
    }

}

export default Events;