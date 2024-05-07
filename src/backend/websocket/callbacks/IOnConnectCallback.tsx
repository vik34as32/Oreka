export default interface IOnWebsocketConnectionListener {
    onConnecting: () => void;
    onConnected: () => void;
    onDisconnected: () => void;
}