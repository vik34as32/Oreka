import ws, { IMessageEvent, client } from 'websocket';
import { EnvVariable, EnvironmentVariables } from '../EnvironmentVariables';
import { HEART_BEAT_WAITING_TIMEOUT, LOGIN_STATUS, MAX_HEART_BEAT_WAITING_ATTEMPTS, RECONNECTION_INTERVAL_TIME } from './WebSocketConstants';
import { WebSocketConnectionState } from './WebsocketConnectionState';
import IOnWebsocketConnectionListener from './callbacks/IOnConnectCallback';
import IOnWebsocketListener from './callbacks/IOnWebsocketMessageCallback';
import IMessageEncryptDecrypter from './encryption/IMessageDecrypter';
import MessageDecrypter from './encryption/MessageDecrypter';
import { MAX_RECONNECTION_ATTEMPT } from './WebSocketConstants';
import { Oreka as ClientMessage } from "../../proto/clientmessage";
import {Oreka as LoginByToken} from "../../proto/LoginByToken";
export default class OrekaWebSocket implements IWebsocket {
    environmentVariables!: EnvVariable;
    webSocket: ws.w3cwebsocket | undefined;
    url: string | undefined;
    msgBuffer:any[] = [];
    isReconnecting = false;
    shouldRetryConnection = true;
    retryHeartBeatCount:number;
    reconnectionAttempt:number;
    connectionCallback!: IOnWebsocketConnectionListener;
    messageCallback!: IOnWebsocketListener;
    systemMessageLogger!: ISystemMessageLogger;
    messageDecrypter: IMessageEncryptDecrypter;
    websocketConnectionState!: WebSocketConnectionState;
    checkWebSocketConnectionRunner: any;
    heartBeatTimer:any;
    reconnectionTimer:any;
    recievedHeartBeatReply:boolean;
    isLoggedIn:boolean;



    

    constructor(url: string | undefined, messageCallback: IOnWebsocketListener, connectionCallback: IOnWebsocketConnectionListener, systemMessageLogger: ISystemMessageLogger) {
        this.url = url;
        this.retryHeartBeatCount = 0;
        this.reconnectionAttempt = 0;
        this.messageDecrypter = new MessageDecrypter();
        this.systemMessageLogger = systemMessageLogger;
        this.messageCallback = messageCallback;
        this.connectionCallback = connectionCallback;
        this.environmentVariables = EnvironmentVariables.getInstance().getVariable();
        this.websocketConnectionState = WebSocketConnectionState.DISCONNECTED;
        this.heartBeatTimer = 0;
        this.reconnectionTimer = 0;
        this.recievedHeartBeatReply = false;
        this.shouldRetryConnection = true;
        this.isLoggedIn = false;
    }


  
    

    sendHeartBeatMessage() {
        // debugger
        // this.sendMessage({
        //     type:"HB_R"
        // })
    }
    retryHeartBeat() {
        // debugger
        this.retryHeartBeatCount++;
        if (this.retryHeartBeatCount >= MAX_HEART_BEAT_WAITING_ATTEMPTS && this.shouldRetryConnection === false) {
            // if exceeded max try then try reconnecting
            this.connectionCallback.onDisconnected();
            this.shouldRetryConnection = true;
            clearInterval(this.heartBeatTimer);
            this.heartBeatTimer= 0;
            this.reconnectionTimer =  setInterval(this.tryReconnection.bind(this),RECONNECTION_INTERVAL_TIME);
        }
        else {
            this.sendHeartBeatMessage();
        }
    }
    setUpHeartBeat() {
        // this.sendHeartBeatMessage();
        // this.heartBeatTimer = setInterval(function(){
        //     if(this.recievedHeartBeatReply) {
        //         this.recievedHeartBeatReply = false;
        //         this.sendHeartBeatMessage();
        //     } else {
        //         this.retryHeartBeat();
        //     }
        // }.bind(this),HEART_BEAT_WAITING_TIMEOUT);
    }

    connect() {
        // debugger
        console.log(this.url,"hhh");
  
        if(!this.shouldRetryConnection || this.reconnectionAttempt > MAX_RECONNECTION_ATTEMPT) return;
        if (!this.url) {
            this.systemMessageLogger?.sendMessage("No websocket url was passed to connect!");
            return;
        }
        this.websocketConnectionState = WebSocketConnectionState.CONNECTING;
        this.connectionCallback?.onConnecting();
          console.log("this url",this.url)
        this.webSocket = new ws.w3cwebsocket(
            this.url,
            undefined,
            undefined,
            undefined,
            { perMessageDeflate: false }
        );
        this.webSocket.binaryType = "arraybuffer";
        this.webSocket.onopen = () => {
            this.msgBuffer.forEach((msg) => {
                this.sendMessage(msg)
            });
            this.msgBuffer = [];
            if (!this.isLoggedIn) {
                alert("Socket connected successfully!");
            }
            this.connectionCallback?.onConnected();
            this.retryHeartBeatCount = 0;
            this.reconnectionAttempt = 0;
            this.shouldRetryConnection = false;
            this.websocketConnectionState = WebSocketConnectionState.CONNECTED;
            clearInterval(this.reconnectionTimer);
            if(this.heartBeatTimer===0 && this.isLoggedIn) this.setUpHeartBeat();
        }

        this.webSocket.onmessage = (message: IMessageEvent) => {
            
            try {
            const arr = new Uint8Array(message.data as ArrayBuffer);
            console.log(arr,"code ove")
            const clientMessage = ClientMessage.ClientMessage.deserialize(arr);
            console.log(clientMessage,"response")
     
             console.log(clientMessage?.loginresponse,"clientMessage")
            if(clientMessage.type === LOGIN_STATUS && clientMessage.loginresponse.status === 'success') {
                window.localStorage.setItem("loginusertype",clientMessage?.loginresponse)

                if(this.heartBeatTimer === 0) this.setUpHeartBeat();
                if(clientMessage.loginresponse.logintoken) localStorage.setItem('authToken',clientMessage.loginresponse.logintoken);
                this.isLoggedIn = true;
            }
            if(clientMessage.type === "HB_S" && clientMessage.hbs.RCODE === "OK") {
                this.recievedHeartBeatReply = true;
            }
            this.messageCallback?.onMessageReceived(clientMessage);
        }catch(e) {
            console.log("error: ", e);
        }

        }

        this.webSocket.onclose = (closeEvent) => {
           
            this.systemMessageLogger?.sendMessage("Socket connection is now closed: " + closeEvent);
            this.connectionCallback?.onDisconnected();
            this.websocketConnectionState = WebSocketConnectionState.DISCONNECTED;
            this.shouldRetryConnection = true;
            ++this.reconnectionAttempt;
            this.connect();
        }

        this.webSocket.onerror = (error) => {
            
            this.systemMessageLogger?.sendMessage("Error in webscket: " + error.message);
            this.messageCallback?.onError(error);
        }
    }


    listen() {
      console.log("Socket Connected Sucessfully")
    }


    sendMessage(message: any,isHighestPriority?:boolean) {
        console.log("message",message)
        if (this.webSocket === undefined || this.websocketConnectionState!== WebSocketConnectionState.CONNECTED) {
            if(isHighestPriority) {
                this.msgBuffer.unshift(message);
            }
            else this.msgBuffer.push(message);
        } else {
            const  converter = ClientMessage.ClientMessage.deserialize(message);
            console.log("websocket",converter)
            var encryptedMessage = this.messageDecrypter?.encrypt(message)
            console.log(encryptedMessage,"encryptedMessage")
            this.webSocket?.send(message);
        }
    }

    tryReconnection() {
  
        if (this.shouldRetryConnection && this.reconnectionAttempt <= MAX_RECONNECTION_ATTEMPT) {
            this.reconnectionAttempt++;
            this.reconnectToWebSocket();
        } 
        else if(this.reconnectionAttempt > MAX_RECONNECTION_ATTEMPT) {
            this.shouldRetryConnection = false;
            clearInterval(this.reconnectionTimer);
            alert('Not able to connect, please refresh the page');
        }
    }

    reconnectToWebSocket() {

        this.systemMessageLogger?.sendMessage("Reconnecting to WebSocket...");
        debugger
        if(this.msgBuffer.filter(msg => msg.type === 'loginbytoken').length === 0) {
            const authToken = localStorage.getItem('authToken');
            if (authToken !== null) {
                const request = LoginByToken.LoginByToken.fromObject({type: "loginbytoken", logintoken: authToken});
                const clientMessage= new ClientMessage.ClientMessage();
                clientMessage.loginbytoken = request;
                const buf = clientMessage.serializeBinary();
                this.sendMessage(buf,true);
            }
           
        }
        this.connect();
    }

    closeConnection() {
 
        this.webSocket?.close();
    }
    connectionState(): WebSocketConnectionState {
        
        return this.websocketConnectionState;

    }
}