class Events {
    constructor(events = []) {
        this._events = {};
        events.forEach(event => this.addEvent(event));
    }

    addEvent(eventName) {
        if (typeof eventName !== "string")
            throw new TypeError("The eventName should be a string");

        if (typeof this._events[eventName] !== "undefined")
            throw new Error(`The event '${eventName}' is already defined.`);

        this._events[eventName] = [];
    }

    get events() {
        return Object.keys(this._events);
    }

    on(eventName, listener) {
        if (typeof this._events[eventName] === "undefined")
            throw new Error(`Unknown event '${eventName}'. Use 'addEvent' method to create the event before attaching any listener to it!`);

        if (typeof listener !== "function")
            throw new TypeError(`The event listener (assigned to '${eventName}') must be a function...`);

        this._events[eventName].push(listener);
    }


    removeListener(eventName, listener) {
        if (typeof this._events[eventName] === "undefined")
            throw new Error(`Unknown event '${eventName}'.`);

        if (!this._events.indexOf(listener))
            console.warn(`Trying to remove unassigned listener from event '${eventName}'...`);

        this._events = this._events.filter(l => l !== listener);

    }

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