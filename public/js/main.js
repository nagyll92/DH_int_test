import Events from "./events.js";

class AppController {
    constructor() {
        console.log("App initialized...");
        this.$Events = new Events(["testEvent"]);
    }

    run() {
        console.log("App running...");
        this.$Events.on("testEvent", (params) => {
            console.log("event emitted", params);
        });
    }
}

window.main = new AppController();