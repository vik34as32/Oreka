import { Box } from "@mui/material";
import React, { ReactElement, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import "../../../../assets/css/addon_configure.css";
import { WebSocketConnectionState } from "../../../../backend/websocket/WebsocketConnectionState";
import {
connectWebSocket,
fetchMetaData,
sendMessage,
} from "../../../../redux/action-handlers/app/AppActions";
import AddonConfigMenu from "./AddonConfigMenu";
import { Oreka as LoginRequest } from "../../../../proto/loginrequest";
import { Oreka as ClientMessage } from "../../../../proto/clientmessage";
import Loader from "../../common/loader/Loader";

export interface AddonConfigureProps {
  websocketStatus: WebSocketConnectionState;
  connectWebSocket: () => void;
}
const AddonConfigure: React.FC<AddonConfigureProps> = (
  props: AddonConfigureProps
): ReactElement => {
  const [isLoading,setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (props.websocketStatus === undefined) {
      setIsLoading(true);
      props.connectWebSocket();
    }
  }, []);
  useEffect(() => {
    if (props.websocketStatus === WebSocketConnectionState.CONNECTED) {
      let request = new LoginRequest.LoginRequest();
      request = LoginRequest.LoginRequest.fromObject({login: "1001", type: "login", pwd: "hello12345", serialNo: "fcd4fe32919aa9d64b69703004fa3a0d"});
      const clientMessage= new ClientMessage.ClientMessage();
      clientMessage.loginrequest = request;
      clientMessage.type = "login";
      const buf = clientMessage.serializeBinary();
      sendMessage(buf, true);
      fetchMetaData("1001");
      setTimeout(() => setIsLoading(false),1000);
    }
  }, [props.websocketStatus]);
  return (
    isLoading ? <Loader size={20}/> :    
    <Box sx={{ p: 2, m: 2 }}>
      <AddonConfigMenu />
    </Box>
  );
};
function mapStateToProps(state: any) {
  return {
    websocketStatus: state.app.websocketConnectionStatus,
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return {
    connectWebSocket: () => connectWebSocket(dispatch),
  };
}

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(AddonConfigure)
);
