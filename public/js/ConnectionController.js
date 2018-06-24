import Events from "./events.js";

/**
 * Class representing a socket.io (webSocket) connection
 * @class ConnectionController
 * @extends Events
 */
class ConnectionController extends Events {
    /**
     * @constructs ConnectionController
     * @param {string} connectionString the URL of the webSocket to connect to
     */
    constructor(connectionString) {
        /**
         * Triggered when the webSocket connection is established.
         * @event ConnectionController#connected
         */

        /**
         * Triggered when the webSocket is disconnected.
         * @event ConnectionController#disconnected
         */

        /**
         * Triggered when a message received on webSocket.
         * @event ConnectionController#messageReceived
         * @param {object} payload the payload of webSocket message
         * @param {string} payload.user the sender of the received message
         * @param {string} payload.message the text of the received message
         */
        super(["connected", "disconnected", "messageReceived"]);

        /**
         * The URL of the webSocket
         * @type {string}
         * @private
         */
        this._connectionString = connectionString;

        /**
         * The object representing the connected socket (null if no connected socket)
         * @type {Socket | null}
         * @private
         */
        this._socket = null;
    }

    /**
     * Connects to the specified webSocket
     */
    connect() {
        this._socket = io.connect(this._connectionString);

        /* Trigger the ConnectionManager events when socket events ar emitted */

        this._socket.on("connect", () => {
            this.trigger("connected");
        });

        this._socket.on("disconnect", () => {
            this.trigger("disconnected");
            this._socket = null;
        });

        this._socket.on("message", (data) => {
            this.trigger("messageReceived", data);
        });
    }

    /**
     * Send the users message on webSocket
     * @param {string} user the name of the user
     * @param {string} message the text of the message to send
     */
    sendMessage(user, message) {
        this._socket.emit("message", {user, message});
    }
}

export default ConnectionController;