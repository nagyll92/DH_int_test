import Layout from "./layout.js";
import Channel from "./channel.js";

const $Layout = new Layout("form", "messagePlaceholder");
const $Channel = new Channel("http://185.13.90.140:8081");

class AppController {
    constructor() {
        console.log("App initialized...");
        this._formData = {
            userName: "Guest001",
            userMessage: ""
        };
    }

    run() {

        $Layout.on("userNameChanged", (userName) => {
            this._formData.userName = userName;
        });

        $Layout.on("messageChanged", (message) => {
            this._formData.userMessage = message;
        });

        $Layout.on("submitClicked", () => {
            const {userName, userMessage} = this._formData;
            $Channel.sendMessage(userName, userMessage);
            $Layout.displayMessage(userMessage, false);
        });

        $Layout.renderLayout();

        $Layout.setFormDisableMode(true);

        $Channel.on("connected", () => {
            $Layout.setFormDisableMode(false);
        });

        $Channel.on("disconnected", () => {
            $Layout.setFormDisableMode(true);
        });

        $Channel.on("messageReceived", ({user: userName, message}) => {
            $Layout.displayMessage(message, true, userName);
        });

        $Channel.connect();

        console.log("App running...");

    }
}

export default new AppController();