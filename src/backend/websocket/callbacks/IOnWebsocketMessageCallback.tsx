export default interface IOnWebsocketListener {
    onMessageReceived: (message: any) => void;
    onError: (error: any) => void;
}