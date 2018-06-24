import UIController from "./UIController.js";
import ConnectionController from "./ConnectionController.js";

const $UIController = new UIController();
const $ConnectionController = new ConnectionController("http://185.13.90.140:8081");

/**
 * The main entry point of the application
 * @class AppController
 */
class AppController {
    /**
     * @constructs AppController
     */
    constructor() {
        /**
         * Holds the default values of the message form
         * @type {{userName: string, userMessage: string}}
         * @private
         */
        this._formData = {
            userName: "Guest001",
            userMessage: ""
        };

        /**
         * Holds the metadata of the user interface. Used during rendering the UI.
         * @type {{formPlaceholderId: string, messagePlaceholderId: string, formDisabled: boolean}}
         * @private
         */
        this._UIMetaData = {
            formPlaceholderId: "form",
            messagePlaceholderId: "messagePlaceholder",
            formDisabled: true
        };
    }

    /**
     * Sets up the application and creates the connection between the modules by attaching the necessary event listeners.
     */
    run() {
        /* Attach the event liteners to the UI controller event emitter */
        $UIController.on("userNameChanged", (userName) => {
            this._formData.userName = userName;
        });

        $UIController.on("messageChanged", (message) => {
            this._formData.userMessage = message;
        });

        $UIController.on("formSubmitted", () => {
            const {userName, userMessage} = this._formData;

            if (!userName || !userMessage)
                return;

            $ConnectionController.sendMessage(userName, userMessage);
            $UIController.displayMessage(userMessage, false);
            this._formData.userMessage = "";
            $UIController.resetForm(this._formData);
        });

        /* Setup the user interface */
        $UIController.init(this._UIMetaData);
        $UIController.renderMessageForm(this._formData);

        /* Prepare the connection by assigning the event listeners to the connection controller */
        $ConnectionController.on("connected", () => {
            $UIController.setFormDisableMode(false);
        });

        $ConnectionController.on("disconnected", () => {
            $UIController.setFormDisableMode(true);
        });

        $ConnectionController.on("messageReceived", ({user: userName, message}) => {
            $UIController.displayMessage(message, true, userName);
        });

        /* Run the main service by connection to the remote server */
        $ConnectionController.connect();

        console.log("App running...");

    }
}

export default new AppController();