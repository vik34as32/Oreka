import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { WebSocketConnectionState } from "../../../../backend/websocket/WebsocketConnectionState";


const useConnection = () => {
    const [isConnected,setIsConnected] = useState<boolean>(true);
    const connectionStatus = useSelector((state:any) => state.app.websocketConnectionStatus);
    useEffect(() => {
        if(connectionStatus === WebSocketConnectionState.CONNECTED) setIsConnected(true);
        else setIsConnected(false);
    },[connectionStatus])
    return isConnected;
}

export default useConnection;