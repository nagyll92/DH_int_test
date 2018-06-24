import Events from "./events.js";

/**
 * Class representing the UI elements, handles the rendering related logic.
 * @class UIController
 * @extends Events
 */
class UIController extends Events {
    /**
     * @constructs UIController
     */
    constructor() {
        /**
         * Triggered when the user changes the username using the input field.
         * @event UIController#userNameChanged
         * @param {string} newUserName the new name specified by the user
         */

        /**
         * Triggered when the user changes the value of the message field.
         * @event UIController#messageChanged
         * @param {string} message the message typed by the user
         */

        /**
         * Triggered when the user clicks to the submit button.
         * @event UIController#formSubmitted
         */
        super(["userNameChanged", "messageChanged", "formSubmitted"]);
        /**
         * Holds the id of the DOM element containing the form
         * @type {string}
         * @private
         */
        this._formPlaceholderId = "";
        /**
         * Holds the id of the DOM element containing the messages
         * @type {string}
         * @private
         */
        this._messagePlaceholderId = "";
        /**
         * Indicates that the form is disabled or not
         * @type {boolean}
         * @private
         */
        this._formDisabled = false;
        /**
         * Identifies the form control DOM elements of the message form
         * @type {string}
         * @private
         */
        this._formControlClass = "formControl";

    }

    /**
     * Initialize the interactive UI
     * @param {object} metaData the metadata of the user interface
     * @param {string} metaData.formPlaceholderId specifies the id of the DOM element where the form should be rendered
     * @param {string} metaData.messagePlaceholderId specifies the id of the DOM element where the messages should be displayed
     * @param {boolean} metaData.formDisabled specifies if the form should be disabled by default or not
     */
    init(metaData) {
        this._formPlaceholderId = metaData.formPlaceholderId;
        this._messagePlaceholderId = metaData.messagePlaceholderId;
        this._formDisabled = metaData.formDisabled;
    }

    /**
     * Displays a new message in the message container
     * @param {string} messageText the text of the message to be displayed
     * @param {boolean} received indicates if the messages is sent or received (true - received, false - sent)
     * @param {string} [sender] the name of the sender user. Omitted if the message is sent by the current user.
     */
    displayMessage(messageText, received = true, sender = "") {
        let messageContainerCssClass= "message ";

        // set text align according to the message type (sent/received)
        if (received) {
            messageContainerCssClass += "received";
        } else {
            messageContainerCssClass += "sent";
        }

        const message = this._displayMessage(messageText, sender, messageContainerCssClass);

        this._render(this._messagePlaceholderId, message);
    }

    /**
     * Renders the message form using the specified data.
     * @param {object} formData the initial values of the form fields
     * @param {string} formData.userName the value of the userName field
     * @param {string} formData.userMessage the value of the message field
     */
    renderMessageForm(formData) {
        this._createForm(formData);
    }

    /**
     * Disables or enables the messages form based on parameter.
     * @param {boolean} mode disables the form if true, enables it otherwise.
     */
    setFormDisableMode(mode) {
        //do nothing if the requested disable mode is already set
        if (this._formDisabled === mode)
            return;

        this._formDisabled = mode;

        const formControls = document.getElementsByClassName(this._formControlClass);
        for (let control of formControls) {
            if (mode) {
                control.setAttribute("disabled", "disabled");
            } else {
                control.removeAttribute("disabled");
            }
        }
    }

    /**
     * Reset the form inputs using the specified values. To be used when the message is sent.
     * @param {object} [formData] the values to be set
     * @param {string} [formData.userName] the value of the userName field (default: "")
     * @param {string} [formData.userMessage] the value of the message string (default: "")
     */
    resetForm(formData = {userName: "", userMessage: ""}) {
        document.getElementById("clientName").value = formData.userName;
        document.getElementById("clientMessage").value = formData.userMessage;
    }

    /**
     * Creates a message DOM element
     * @param {string} messageText the text to be displayed
     * @param {string} sender the name of the sender
     * @param {string} messageContainerCssClass the list of the css classes to assign to message container.
     * @return {Element} the DOM element to be rendered
     * @private
     */
    _displayMessage(messageText, sender, messageContainerCssClass) {
        // create the wrapper DOM node for the message
        const message = document.createElement("p");
        message.setAttribute("class", messageContainerCssClass);

        //create the container DOM node for the sender of the message
        const senderElement = document.createElement("span");
        senderElement.setAttribute("class", "sender");
        senderElement.innerText = sender;
        
        message.appendChild(senderElement);

        //create the container DOM node for the message text
        const messageHTML = document.createElement("span");
        messageHTML.innerText = messageText;

        message.appendChild(messageHTML);
        return message;
    }

    /**
     * Creates the DOM elements of the form. Attaches the required event listeners and renders the form.
     * @param {object} formData the initial values of the form fields
     * @param {string} formData.userName the value of the userName field
     * @param {string} formData.userMessage the value of the message field
     * @private
     */
    _createForm(formData) {
        const userFieldData = {
            id: "clientName",
            class: this._formControlClass,
            type: "text",
            value: formData.userName,
            placeholder: "Your name..."
        };

        const messageFieldData = {
            id: "clientMessage",
            class: this._formControlClass,
            type: "text",
            value: formData.userMessage,
            placeholder: "Type your message here..."
        };

        const submitButtonData = {
            id: "submitMessage",
            class: this._formControlClass,
            type: "button",
            value: "Send"
        };

        //set the disabled status of the form controls according to default value
        if (this._formDisabled) {
            userFieldData.disabled = "disabled";
            messageFieldData.disabled = "disabled";
            submitButtonData.disabled = "disabled";
        }

        const userNameField = this._createFormField(userFieldData, (e) => {

            this.trigger("userNameChanged", e.target.value);
        });
        const userMessageField = this._createFormField(messageFieldData, (e) => {
            this.trigger("messageChanged", e.target.value);
        });
        const submitMessageButton = this._createFormField(submitButtonData, () => {
            this.trigger("formSubmitted");
        });

        const targetId = this._formPlaceholderId;
        this._render(targetId, userNameField);
        this._render(targetId, userMessageField);
        this._render(targetId, submitMessageButton);
        this._attachSubmitOnEnter();
    }

    /**
     * Attach event listener to form to trigger 'formSubmitted' event when Enter key is pressed.
     * @private
     */
    _attachSubmitOnEnter() {
        const form = document.getElementById(this._formPlaceholderId);
        form.addEventListener("keyup", (e) => {
            if (e.code === "Enter")
                this.trigger("formSubmitted");
        });
    }

    /**
     * Renders the provided element in the specified target
     * @param {string} targetId the id of the target node
     * @param {Element} element the element to be rendered
     * @private
     */
    _render(targetId, element) {
        document.getElementById(targetId).appendChild(element);
    }

    /**
     * Creates a form element using the provided configuration and event handler
     * @param {Object} config The configuration of the form element
     * @param handler
     * @return {Element}
     * @private
     */
    _createFormField(config = {
        id: Date.now(),
        class: "",
        name: "",
        type: "text",
        value: "",
        placeholder: ""
    }, handler = null) {
        //create an input form control
        const field = document.createElement("INPUT");

        //set the attributes of the input field according to its configuration
        for (let attr in config) {
            if (config.hasOwnProperty(attr))
                field.setAttribute(attr, config[attr]);
        }

        //create a default event handler for the form controls.
        if (!handler || typeof handler !== "function") {
            handler = (e) => {
                console.info("Intercepted unhandled UI event", e);
            };
        }

        //assign the event handler to form control according to its type
        switch (config.type) {
            case "text":
                field.addEventListener("change", handler);
                break;
            case "button":
                field.addEventListener("click", handler);
                break;
            default:
                break;
        }

        return field;
    }

}

export default UIController;