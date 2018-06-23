import Events from "./events.js";

/**
 * Class representing the UI elements, handles the rendering related logic.
 * @class Layout
 * @extends Events
 */
class Layout extends Events {
    /**
     * @constructs Layout
     * @param {string} formPlaceholderId the 'id' parameter of the HTML node that should hold the form
     * @param {string} messagePlaceholderId the 'id' parameter of the HTML that should hold the messages
     */
    constructor(formPlaceholderId, messagePlaceholderId) {
        /**
         * Triggered when the user changes the username using the input field.
         * @event Layout#userNameChanged
         * @param {string} newUserName the new name specified by the user
         */

        /**
         * Triggered when the user changes the value of the message field.
         * @event Layout#messageChanged
         * @param {string} message the message typed by the user
         */

        /**
         * Triggered when the user clicks to the submit button.
         * @event Layout#submitClicked
         */
        super(["userNameChanged", "messageChanged", "submitClicked"]);
        this.formPlaceholderId = formPlaceholderId;
        this.formControlClass = "formControl";
        this.messagePlaceholderId = messagePlaceholderId;
    }

    /**
     * Displays a new message in the message container
     * @param {string} messageText the text of the message to be displayed
     * @param {boolean} received indicates if the messages is sent or received (true - received, false - sent)
     * @param {string} [sender] the name of the sender user. Omitted if the message is sent by the current user.
     */
    displayMessage(messageText, received = true, sender = "") {

        let elementClass = "message ";
        if (received) {
            elementClass += "received";

        } else {
            elementClass += "sent";
        }

        const message = this._displayMessage(messageText, sender, elementClass);

        this._render(this.messagePlaceholderId, message);
    }

    /**
     * Renders the message form in the specified placeholder.
     */
    renderLayout() {
        this._createForm(this.formPlaceholderId);
    }

    /**
     * Disables or enables the messages form based on parameter.
     * @param {boolean} mode disables the form if true, enables it otherwise.
     */
    setFormDisableMode(mode) {
        const formControls = document.getElementsByClassName(this.formControlClass);
        for (let control of formControls) {
            if (mode) {
                control.setAttribute("disabled", "disabled");
            } else {
                control.removeAttribute("disabled");
            }
        }
    }

    /**
     * Creates a message DOM element
     * @param {string} messageText the text to be displayed
     * @param {string} sender the name of the sender
     * @param {string} elementClass the list of the css classes to be used.
     * @return {Element} the DOM element to be rendered
     * @private
     */
    _displayMessage(messageText, sender, elementClass) {

        const message = document.createElement("p");
        const senderElement = document.createElement("span");

        senderElement.setAttribute("class", "sender");
        senderElement.innerText = sender;
        message.appendChild(senderElement);

        message.setAttribute("class", elementClass);

        const messageHTML = document.createElement("span");

        messageHTML.innerText = messageText;

        message.appendChild(messageHTML);
        return message;
    }

    /**
     * Creates the DOM elements of the form. Attaches the required event listeners and renders the form.
     * @param {string} targetId the id of the target node
     * @private
     */
    _createForm(targetId) {
        const userNameField = this._createFormField({
            id: "clientName",
            class: this.formControlClass,
            type: "text",
            value: "Guest",
            placeholder: "Your name..."
        }, (e) => {

            this.trigger("userNameChanged", e.target.value);
        });

        const userMessageField = this._createFormField({
            id: "clientMessage",
            class: this.formControlClass,
            type: "text",
            placeholder: "Type your message here..."
        }, (e) => {
            this.trigger("messageChanged", e.target.value);
        });

        const submitMessageButton = this._createFormField({
            id: "submitMessage",
            class: this.formControlClass,
            type: "button",
            value: "Send"
        }, () => {
            this.trigger("submitClicked");
        });

        this._render(targetId, userNameField);
        this._render(targetId, userMessageField);
        this._render(targetId, submitMessageButton);
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
     * @param {Object} [config] The configuration of the form element
     * @param {string} [config.id] the id of the form element (default: Date.now())
     * @param {string} [config.class] the css class attribute of the form element (default: "")
     * @param {string} [config.name] the name attribute of the form element (default: "")
     * @param {string} [config.type] the type attribute of the form element (default: ""). It defines also the type of the assigned event handler
     * @param {string} [config.value] the value attribute of the form element (default: "")
     * @param {string} [config.placeholder] the placeholder attribute of the form element (default: "")
     * @param {Function} [handler] the event handler to be attached to the form element.
     * @return {Element} The form input DOM element
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

        const field = document.createElement("INPUT");
        for (let attr in config) {
            if (config.hasOwnProperty(attr))
                field.setAttribute(attr, config[attr]);
        }

        if (!handler || typeof handler !== "function") {

            handler = (e) => {
                console.info("Intercepted unhandled UI event", e);
            };
        }

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

export default Layout;