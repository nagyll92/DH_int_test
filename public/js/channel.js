import Events from "./events.js";

class Channel extends Events {
    constructor(connectionString) {
        super(["connected", "disconnected", "messageReceived"]);
        this._connectionString = connectionString;
        this._socket = null;
    }

    connect() {
        this._socket = io.connect(this._connectionString);
        this._socket.on("connect", () => {
            this.trigger("connected");
        });

        this._socket.on("disconnect", () => {
            this.trigger("disconnected");
        });

        this._socket.on("message", (data) => {
            this.trigger("messageReceived", data);
        });
    }

    sendMessage(user, message) {
        this._socket.emit("message", {user, message});
    }
}

export default Channel;