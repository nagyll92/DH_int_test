class AppController {
    constructor() {
        console.log("App initialized...");
    }

    run(){
        console.log("App running...");
    }
}

window.main = new AppController();