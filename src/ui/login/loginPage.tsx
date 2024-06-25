import Avatar from "@mui/material/Avatar";
import { Dispatch } from "redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { WebSocketConnectionState } from "../../backend/websocket/WebsocketConnectionState";
import * as appActions from "../../redux/action-handlers/app/AppActions";
import * as loginActions from "../../redux/action-handlers/login/LoginActions";
;
// import "../../assets/css/LoginPage.css";
import MessageComponent from "../components/common/message/MessageComponent";
import { Oreka as LoginByToken} from "../../proto/LoginByToken";
import { Oreka as ClientMessage } from "../../proto/clientmessage";
import { DataSourceSubscriber, deregisterDealingPanel, registerDealingPanel,LoginPanelSubscriber,registerLoginDevicePanel, setActiveColumnsForDataSource, updateDealingPanelSubscription,subscribeToTicker,AlerttSystem } from '../../redux/action-handlers/app/AppActions'
import WatchListServiceFactory  from '../../backend/data-subcription/WatchListService'
import { useSelector } from "react-redux";




type Props = {
  websocketStatus: WebSocketConnectionState,
  datasources: undefined,
  connectWebSocket: () => void,
  fetchHeadersTiles: (id: string) => void,
  fetchMetaData: (id: string) => void,
  loginUser: any,
  addWidgetMetaData: any,
  showAddWidgetModal: boolean,
  showAddWidgetCustomModal: boolean,
  openWidgetAddModal: (flag: boolean) => void,
  addCustomWidgetDialog: (flag: boolean) => void,
  fetchClientsAndSymbols:() => void
  tdhModelState:boolean;
  sendMessage:(message:any,isHighestPriority?:boolean) => void;
  loginSettingsModalState: boolean;
  toggleLoginSettingsModal:(open:boolean,loginValue:string) => void;
}


const subscriber: DataSourceSubscriber = {
  id: 'dealing-panel',
  listenEvent: 'DEALING_DATA_INTERVAL',
  subscribeEvent: 'FETCH_DEALING_DATA_INTERVAL',
  unsubscribeEvent: 'FETCH_DEALING_DATA_INTERVAL',
  isLive: false,
  uniqueKeys: ["id"]
}

const loginsubscriber: LoginPanelSubscriber = {
  id: 'login-device-panel',
  listenEvent: 'LOGIN_DEVICE_LOG',
  subscribeEvent: 'FETCH_LOGIN_DEVICE_LOG',
  unsubscribeEvent: 'FETCH_LOGIN_DEVICE_LOG',
  isLive: false,
  uniqueKeys: ["id"],
}
import { convert } from "@finos/perspective-viewer";



// export const DataRevicer = (data: any) => {
//   console.log(data, "hhhhhh");
// }
const Loginresponse= (props:any) => {
  const storedData = window.localStorage.getItem("storedData");
  const loginusertype = window.localStorage.getItem("loginusertype");
  console.log(props,"131")

  const [user, setUser] = useState<string | null>(null);
  const [stoageData,setstoageData] =useState<string[]>([])

  // const getDataFromLocalStorage = () => {
  //   if (storedData) {
  //     setUser(storedData);
  //   }
  // };

  console.log(stoageData,"stoageDatastoageData")

  useEffect(() => {
    if (loginusertype) {
      setUser(loginusertype);
   
    }
  }, [loginusertype]);

  useEffect(() => {
    if (props && props.tickData && props.tickData.insert) {
      window.localStorage.removeItem("loginusertype")
      console.log("ddaaddd")
      setUser(null)
      setstoageData(prevData => [
        ...prevData,
        ...props.tickData.insert
      ]);
    }
  }, [props.tickData]);

  return (
    <div style={{ color: "wheat" }}>
      <textarea
       value={user || JSON.stringify(stoageData)|| ""}
        readOnly // to prevent editing
        placeholder="Type something..."
        rows={10} // Set the number of rows
        cols={100} // Set the number of columns
      />
    </div>
  );
}



function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
      sx={{ alignItems: "center", justifyContent: "center" }}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://auttrading.com/">
        auttrading.com 
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

type LoginPropType = {
  fingerPrint: string;
  fetchFingerPrint: () => void;
  login: (login: string, pwd: string, fingerprint: string) => void;
  sendMessage: (message: any) => void;
  addCustomWidgetDialog: () => void;
  connectWebSocket: () => void;
  loginUser: any;
  tickdata: any;
  websocketStatus: WebSocketConnectionState;
  setAlertMessage: (message: string, messageType: string) => void;
};

type LoginState = {
  open: boolean
  userName: string;
  password: string;
  connectUrl: string;
};

const LoginRequest = () => {
  const [user, setUser] = useState({
      email: "",
      password: "",
      fingerPrint: "",
      type: ""
  });
  const [bufferData, setBufferData] = useState({});

  useEffect(() => {
      const loginUserData = window.localStorage.getItem("loginuser");
      const convertedData = window.localStorage.getItem("convertedLogindata");

      if (loginUserData) {
          const parsedUserData = JSON.parse(loginUserData);
          setUser(prevUser => ({
              ...prevUser,
              email: parsedUserData.login,
              password: parsedUserData.pwd,
              fingerPrint: parsedUserData.serialNo,
              type: parsedUserData.type
          }));
      }

      if (convertedData) {
          const parsedBufferData = JSON.parse(convertedData);
          setBufferData(prevBufferData => ({
              ...prevBufferData,
              ...parsedBufferData
          }));
      }
  }, []);

  return (
      <div style={{ color: "wheat" }}>
          {user.email ? (
              <div>
                  <p>User data: </p>
                  <p>Email: {user.email}</p>
                  <p>Password: {user.password}</p>
                  <p>FingerPrint: {user.fingerPrint}</p>
                  <p>Type: {user.type}</p>
                  {/* <h1>
                    <h2>
                      <h3><p>Buffer data: {JSON.stringify(bufferData)}</p></h3>
                    </h2>
                  </h1>
                   */}
              </div>
          ) : (
              <p>No user data available.</p>
          )}
      </div>
  );
}


class LoginPage extends Component<LoginPropType, LoginState> {
  authTokenLogginAttempt: boolean;
  isNewRequest: boolean;
  constructor(props: LoginPropType) {
    super(props);
    this.authTokenLogginAttempt = false;
    this.isNewRequest = false;
    this.state = {
      open: false,
      userName: "",
      password: "",
      connectUrl: "wss://auttrading.com:9986" // Initialize connectUrl
    };
  }

  styles: any = {
    logoCenter: {
      position: "absolute",
      zIndex: 99,
      width: "20%",
      padding: 5,
      backgroundColor: "#13171F",
      transition: "100% 0.5s ease",
    },
  };

  componentDidMount(): void {
    this.props.connectWebSocket();
    this.props.fetchFingerPrint();
  }
  componentDidUpdate(
    prevProps: Readonly<LoginPropType>,
    prevState: Readonly<LoginState>,
    snapshot?: any
  ): void {
    if (
      this.props.websocketStatus === WebSocketConnectionState.CONNECTED &&
      !this.authTokenLogginAttempt
    ) {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        this.authTokenLogginAttempt = true;
        const request = LoginByToken.LoginByToken.fromObject({type: "loginbytoken", logintoken: authToken});
        const clientMessage= new ClientMessage.ClientMessage();
        clientMessage.loginbytoken = request;
        const buf = clientMessage.serializeBinary();
        this.props.sendMessage(buf);
      }
    }
    if (this.isNewRequest && this.props.loginUser) {
      if (this.props.loginUser.status === "invalid credentials") {
        this.props.setAlertMessage("Wrong Password !!", "error");
        this.setState({ password: "" });
      } else if (this.props.loginUser.status === "invalid SerialNo") {
        this.props.setAlertMessage("Invalid Login Id", "error");
        this.setState({ userName: "", password: "" });
      }
      this.isNewRequest = false;
    }
  }



//   useEffect(() => {
//     if (websocketStatus === undefined)
//         connectWebSocket();
// }, [websocketStatus, connectWebSocket]);

webscoketConneter = () => {
  const { connectUrl } = this.state;
  debugger
  const { websocketStatus, connectWebSocket } = this.props;

  if (connectUrl && websocketStatus === undefined) {
      console.log("Connect URL:", connectUrl);
      window.localStorage.setItem("url", connectUrl);
      connectWebSocket(); // Assuming connectWebSocket is a prop function to connect the WebSocket
  }
}


handleSubmit = (): void => {
  const { userName } = this.state;
  const data = JSON.parse(userName);
  console.log(data, "jjj");

  switch (data?.type) {
    case "login":
      console.log(data, "ql");
      console.log(data, "12211");
      const email = data.login;
      const password = data.pwd;
      const fingerPrint = "";
      console.log("serialNo", fingerPrint);

      if (email !== undefined && password !== undefined) {
        this.props.login(email, password, fingerPrint);
        this.isNewRequest = true;
      }
      break;

    case "FETCH_DEALING_DATA_INTERVAL":
      console.log(data, "eeeeeeee");
      if (data.subscriptionId !== undefined && data.startTime !== undefined && data.endTime !== undefined) {
        registerDealingPanel(subscriber, this.websocketConneter, data.subscriptionId, data.startTime, data.endTime);
      }
      break;

    case "FETCH_LOGIN_DEVICE_LOG":
      console.log(data, "kkkkkkkk");
      if (data.startTime !== undefined && data.endTime !== undefined) {
        registerLoginDevicePanel(loginsubscriber, data.startTime, data.endTime);
      }
      break;

    case "SUBSCRIBE_TICKER":
      console.log(data, "mk");
      if (data.tickers !== undefined) {
        subscribeToTicker(data.type, data.tickers);
      } 
      break;

    case "SAVE_UPDATE_ALERT":
      console.log(data, "mk");
      if (data.type !== undefined) {
        AlerttSystem(data)
      } 
      break;

    default:
      console.log("Unknown data type:", data?.type);
       
      break;
  }
};




  render() {
    console.log(this.props,"app")
    if (this.props.loginUser && this.props.loginUser.status === "success") {
      return ;
    }
    return (
      
      <>
      <h1 style={{ color: "orange" }}>Web Socket Client:</h1>
      <p style={{ color: "black" }}>WebSocket Address:</p>
      <input
        type="text"
        name="url"
        value={"wss://auttrading.com:9986"}
        onChange={(e)=>this.setState({connectUrl:"wss://auttrading.com:9986"})}
      />
      <button onClick={this.webscoketConneter}>Connect</button>
      <br />
      <div>
        <b style={{ color: "black" }}>Tick Data User Credentials:</b>
        <div id="activedescendant">
          <input aria-controls="list" aria-label="Search"  value={this.state.userName} /> <button onClick={this.handleSubmit}>send</button>
          <ul id="list" style={{ color: "black" }}>
          <li onClick={() => this.setState({ userName: '{"type":"login","login":"1001","pwd":"&FXAU1823@#!tkio","serialNo":""}' })}>Login</li>
          <li onClick={() => this.setState({ userName: '{"type":"SUBSCRIBE_TICKER","tickers":["GOLDJUN"]}' })}>Subscriber</li>
          <li onClick={() => this.setState({ 
     userName: '{"type":"SAVE_UPDATE_ALERT","alertName":"gold","triggerType":"Client Position Table > Position Volume Update","startTime":"2024-06-05 00:01","expiryTime":"","daysOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"selectedMonths":["January","February","March","April","May","June","July","August","September","October","November","December"],"daysOfMonth":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"],"repetitions":2,"days":1,"hours":0,"minutes":0,"conditions":[{"compareCondition":"Not equal","conditionType":"Schedule > Date","conditionValue":"thtyg","orCondition":[{"orCompareCondition":"Equals (=)","orConditionType":"Account > Client Brokage","orConditionValue":"bhgj"}]},{"compareCondition":"Equals (=)","conditionType":"Symbol > Symbol","conditionValue":"dfthy","orCondition":[]}],"actions":[{"action":"Message > Send to Oreka","actionName":"helloo","actionSendBy":"Trigger","actionSendTo":"*","actionTrigger":"hello"}]}' 
})}>
    EventManagementSystemData
</li>



            {/* <li value='{"type":"SUBSCRIBE_TICKER","tickers":["XAUZ"]}' onChange={(e) => this.setState({ userName: e.target.value })}>Subscriber</li> */}
          </ul>
        </div>
      </div>
      <Loginresponse   {...this.props}/>
    </>
      
    );
  }

  handleAddCustomDialog() {
    this.props.addCustomWidgetDialog();
  }
}

function mapStateToProps(state: any) {
  return {
    fingerPrint: state.app.fingerPrint,
    loginUser: state.app.loginUser,
    tickData:state.app.tickData,
    websocketStatus: state.app.websocketConnectionStatus,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    connectWebSocket: () => appActions.connectWebSocket(dispatch),
    fetchFingerPrint: () => loginActions.fetchFingerPrint(dispatch),
    sendMessage: (message: any) => appActions.sendMessage(message, true),
    login: (login: string, password: string) =>
      loginActions.loginUser(login, password),
    addCustomWidgetDialog: () => appActions.openCustomWidgetAddModal(true),
    setAlertMessage: (message: string, messageType: string) =>
      dispatch(appActions.setAlertMessage(message, messageType)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
