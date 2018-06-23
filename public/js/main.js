import Layout from "./layout.js";

const $Layout = new Layout("form", "messagePlaceholder");

class AppController {
    constructor() {
        console.log("App initialized...");

    }

    run() {

        $Layout.on("userNameChanged", (userName) => {
            console.log("username change to ", userName);
        });


        $Layout.renderLayout();

        setTimeout(() => {
            $Layout.displayMessage("message sent", false);
            $Layout.displayMessage("messaged received", true, "AnotherBot");
        }, 300);

        console.log("App running...");

    }
}

export default new AppController();