import { Dispatch } from "redux";
import { EnvironmentVariables } from "../../../backend/EnvironmentVariables";
import OrekaWebSocket from "../../../backend/websocket/Websocket";
import { WebSocketConnectionState } from "../../../backend/websocket/WebsocketConnectionState";
import IOnWebsocketConnectionListener from "../../../backend/websocket/callbacks/IOnConnectCallback";
import IOnWebsocketListener from "../../../backend/websocket/callbacks/IOnWebsocketMessageCallback";
import {
  ReducerActionConstants,
  ReducerConstants,
} from "../../../config/reducers/ReducerConstants";
import { TdhData } from "../../../ui/components/popups/tdh/TdhModal";
import { themes } from "../../../data/colorTemplate";
import { Theme } from "../../../ui/components/widgets/ThemeModal/ThemeTemplateModal";
import { Oreka as ClientMessage } from "../../../proto/clientmessage";
import { Oreka as AlertSetting } from "../../../proto/AlertSetting";
// import { Oreka as FetchClientPositions } from "../../../proto/FetchClientPositions";
// import { Oreka as FetchColorTemplates } from "../../../proto/FetchColorTemplates";
// import { Oreka as SaveColorTemplate } from "../../../proto/SaveColorTemplate";
// import { Oreka as DeleteTemplate } from "../../../proto/DeleteTemplate";
// import { Oreka as DeleteColorTheme } from "../../../proto/DeleteColorTheme";
// import { Oreka as FetchLoginUserWiseDataRequest } from "../../../proto/FetchLoginUserWiseDataRequest";
// import { Oreka as ActiveColumnChanged } from "../../../proto/ActiveColumnChanged";
// import { Oreka as Unsubscribe } from "../../../proto/Unsubscribe";
// import { Oreka as TdhExecution } from "../../../proto/TdhExecution";
// import { Oreka as FetchHighLowMismatchData } from "../../../proto/FetchHighLowMismatchData"; 
 import { Oreka as FetchDealingDataInterval } from "../../../proto/FetchDealingDataInterval";
import {Oreka as FetchLoginDevice} from "../../../proto/FetchLoginDevice"
import { Oreka as SubscribeTicker } from "../../../proto/SubscribeTicker";
// import { Oreka as SaveColorTheme } from "../../../proto/SaveColorTheme";
// import { Oreka as UpdateDataByTablename } from "../../../proto/UpdateDataByTablename";
// import { Oreka as LoginDeviceLog } from "../../../proto/loginDevice";
// import {Oreka as FetchLoginDevieceLog} from '../../../proto/FetchLoginDeviecelog';
var websocket: OrekaWebSocket;








export interface DataSourceSubscriber {
  id: string;
  listenEvent: string;
  subscribeEvent: string;
  unsubscribeEvent: string;
  isLive: boolean;
  uniqueKeys?: string[];
}
export interface LoginPanelSubscriber {
  id: string;
  listenEvent: string;
  subscribeEvent: string;
  unsubscribeEvent: string;
  isLive: boolean;
  uniqueKeys?: string[];
}



// Define TypeScript interfaces to match the Protobuf messages
interface OrConditionData {
  orConditionType: string;
  orCompareCondition: string;
  orConditionValue: string;
}

interface Condition {
  conditionType: string;
  compareCondition: string;
  conditionValue: string;
  orCondition: OrConditionData[];
}

interface Action {
  action: string;
  action_name: string;
  action_send_by: string;
  action_send_to: string;
  action_trigger: string;
}

interface EventManagementSystemData {
  alertName: string;
  triggerType: string;
  startTime: string;
  expiryTime: string;
  noExpiry: boolean;
  daysOfWeek: number[];
  selectedMonths: number[];
  daysOfMonth: number[];
  repetitions: number;
  days: number;
  hours: number;
  minutes: number;
  activeStepIndex: number;
  conditions: Condition[];
  actions: Action[];
}

const subscriberLookUp = new Map<string, DataSourceSubscriber>();
const listeners = new Map<string, DatasourceChangeListener>();
const messageToIdMap = new Map<string, string>();
const dealingPanelListeners = new Map<string, DatasourceChangeListener>();
const LoginPanelListeners =new Map<string, DatasourceChangeListener>();

console.log("listeners",listeners)

export function connectWebSocket(dispatcher: Dispatch<any>) {
  console.log(dispatcher,"dispatcherdispatcher")
  var environmentVariables = EnvironmentVariables.getInstance();
  console.log(environmentVariables,"environmentVariablesenvironmentVariables")

  var websocketConnectionCallback = {
    onConnecting: () => {
      //  debugger
      dispatcher({
        type: ReducerConstants.websocketConnectionStatus,
        data: WebSocketConnectionState.CONNECTING,
      });
    },
    onConnected: () => {
      // debugger
      dispatcher({
        type: ReducerConstants.websocketConnectionStatus,
        data: WebSocketConnectionState.CONNECTED,
      });
    },
    onDisconnected: () => {
      // debugger
      dispatcher({
        type: ReducerConstants.websocketConnectionStatus,
        data: WebSocketConnectionState.DISCONNECTED,
      });
    },
  } as IOnWebsocketConnectionListener;

  var messageCallback = {
    onMessageReceived: async (message: any) => {
      const subscriber = messageToIdMap.get(message.toObject().type);
      const listenEvent = message.toObject().type;
      const { type, ...messageObj } = message.toObject();
      //  debugger;
      if (subscriber) {
        listeners.get(subscriber)?.onDataReceived(Object.values(messageObj)[0]);
      } else if (listenEvent === "DEALING_DATA_INTERVAL") {
        if (messageObj.dealingdatainterval.subscriptionId) {
          dealingPanelListeners
            .get(messageObj.dealingdatainterval.subscriptionId)
            ?.onDataReceived(messageObj);
        }
      } else if (listenEvent === "LOGIN_DEVICE_LOG") {
      
        
        if (messageObj.logindeviecelog.subscriptionId) {
          LoginPannelListeners
            .get(messageObj.logindeviecelog.subscriptionId)
            ?.onDataReceived(messageObj);
        }
      } else {
       
        console.log(Object.values(messageObj)[0],"Object.values(messageObj)[0]Object.values(messageObj)[0]")
        
        dispatcher(Object.values(messageObj)[0]);
      }
    },
    onError: (error) => {
      dispatcher({
        type: ReducerConstants.SystemLogs,
        data: error,
      });
    },
  } as IOnWebsocketListener;

  var systemMessageLogger = {
    sendMessage: (message: string) => {
      dispatcher({
        type: ReducerConstants.SystemLogs,
        data: message,
      });
    },
  } as ISystemMessageLogger;

  if (!websocket) {
    console.log(environmentVariables.getVariable().webSocketUrl,"ku dia ")
    websocket = new OrekaWebSocket(
      environmentVariables.getVariable().webSocketUrl ,
      messageCallback,
      websocketConnectionCallback,
      systemMessageLogger
    );
    websocket.connect();
  }
}

export function getBufferDataForFetchLoginUserWiseDataRequest(eventType: string, loginUser?: string) {
  const request = FetchLoginUserWiseDataRequest.FetchLoginUserWiseDataRequest.fromObject({type: eventType, loginUser: loginUser});
  const clientMessage= new ClientMessage.ClientMessage();
  clientMessage.typeandloginrequest = request;
  const buf = clientMessage.serializeBinary();
  return buf;
}

export function sendMessage(message: any, isHighestPriority?: boolean) {
  const  converter = ClientMessage.ClientMessage.deserialize(message);
  console.log("buffer data",converter )
  websocket.sendMessage(message, isHighestPriority);
}

export function fetchMetaData(login: string) {
  const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.fetchClientPositionMetadata, login)
  return websocket.sendMessage(buf);
}

export function fetchHeadersTiles(login: string) {
  const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerActionConstants.FetchColumnTemplate, login)
  return websocket.sendMessage(buf);
}

export function registerDataStream(
  subscriber: DataSourceSubscriber,
  cb: DatasourceChangeListener
) {
  if (listeners.has(subscriber.id)) return;
  const loggedInUser = localStorage.getItem("loginUser");
  if (!loggedInUser) return;
  subscribe(subscriber, loggedInUser);
  subscriberLookUp.set(subscriber.id, subscriber);
  listeners.set(subscriber.id, cb);
  messageToIdMap.set(subscriber.listenEvent, subscriber.id);
}
export function subscribe(subscriber: DataSourceSubscriber, loginUser: string) {
  //debugger
  const buf = getBufferDataForFetchLoginUserWiseDataRequest(subscriber.subscribeEvent, loginUser)
  sendMessage(buf);
}





// Convert data to the expected Protobuf format and call AlertSetting.fromObject
export function AlerttSystem(alertdata: EventManagementSystemData): void {
  console.log("alertdata", alertdata);
  debugger


  // Convert the data to match the Protobuf structure
  const request = AlertSetting.AlertSetting.fromObject({
    type: "SAVE_UPDATE_ALERT",
    alert_name: alertdata.alertName,
    trigger_type: alertdata.triggerType,
    start_time: alertdata.startTime,
    expiry_time: alertdata.expiryTime,
    days_of_week: alertdata.daysOfWeek.map(String),
    selected_months: alertdata.selectedMonths.map(String),
    days_of_month: alertdata.daysOfMonth.map(String),
    repetitions: alertdata.repetitions,
    days: alertdata.days,
    hours: alertdata.hours,
    minutes: alertdata.minutes,
    conditions: alertdata.conditions.map(condition => ({
        conditionType: condition.conditionType,
        compareCondition: condition.compareCondition,
        conditionValue: condition.conditionValue,
        or_condition: condition.orCondition.length > 0 ? condition.orCondition.map(orCond => ({
            orConditionType: orCond.orConditionType,
            orCompareCondition: orCond.orCompareCondition,
            orConditionValue: orCond.orConditionValue
        })) : []
    })),
    actions: alertdata.actions.map(action => ({
        action: action.action,
        action_name: action.action_name,
        action_send_by: action.action_send_by,
        action_send_to: action.action_send_to,
        action_trigger: action.action_trigger
    }))
});


  // Log the request object to verify its structure
  console.log("Request object:", request);
  const clientMessage= new ClientMessage.ClientMessage();
  clientMessage.alertsetting = request;
  const buf = clientMessage.serializeBinary();
  sendMessage(buf);  
}



// FETCH_DEALING_DATA_INTERVAL
export function subscribeDealingPanel(
  subscriber: DataSourceSubscriber,
  loginUser: string,
  optionalParam?: any
) {
  const request = FetchDealingDataInterval.FetchDealingDataInterval.fromObject({
    type:subscriber.subscribeEvent,
    loginUser: loginUser,
    startTime: optionalParam.startTime,
    endTime: optionalParam.endTime,
    subscriptionId: optionalParam.subscriptionId
  });
  console.log("subscriber.subscribeEvent subscribeDealingPanel",subscriber.subscribeEvent)
   //debugger
  const clientMessage= new ClientMessage.ClientMessage();
  clientMessage.fetchDealingdatainterval = request;
  const buf = clientMessage.serializeBinary();
  const  converter = ClientMessage.ClientMessage.deserialize(buf);
  console.log(converter,"fech  Dealing pannel")
  debugger
  sendMessage(buf);
}


export function LoginDevicePanel(
  subscriber: LoginPanelSubscriber,
  optionalParam?: any
) {
  const request = FetchLoginDevice.FetchLoginDevice.fromObject({
    type: subscriber.subscribeEvent,
    startTime: optionalParam.startTime,
    endTime: optionalParam.endTime,
  });

  console.log(request,"request")
  console.log("subscriber.subscribeEvent LoginDevicePanel",subscriber.subscribeEvent)
  const clientMessage= new ClientMessage.ClientMessage();
  clientMessage.fetchlogindevice = request;
  debugger
  const buf = clientMessage.serializeBinary();
  const  converter = ClientMessage.ClientMessage.deserialize(buf);
  console.log(converter,"buffer conter")
  sendMessage(buf);
}


export function  subscribeToTicker(subscriptionId: string, tickers: string[]) {
   console.log(tickers,"tickerstickers")

  // // return if not registered
  // if (!this.subscriptionCallBack.has(subscriptionId)) return;

  // let tickerSubscription = this.subscriptionTickers.get(subscriptionId);
  // if (!tickerSubscription) {
  //   // if doesn't exists, add it
  //   const subscribedTickers = new Set<string>(tickers);
  //   this.subscriptionTickers.set(subscriptionId, subscribedTickers);
  // } else {
  //   // else update it
  //   tickers.forEach((ticker) => {
  //     tickerSubscription?.add(ticker);
  //   });
  // }

  // tickers.forEach((ticker) => this.activeTickers.add(ticker));
  
  const request = SubscribeTicker.SubscribeTicker.fromObject({ type:"SUBSCRIBE_TICKER", tickers:tickers});
  const clientMessage= new ClientMessage.ClientMessage();
  clientMessage.subscribeticker = request;
  const buf = clientMessage.serializeBinary();
  const  converter = ClientMessage.ClientMessage.deserialize(buf);
  console.log(converter,"buffer conter")
  debugger
  sendMessage(buf);
}

// FETCH_DEALING_DATA_INTERVAL

export function registerDealingPanel(
  subscriber: DataSourceSubscriber,
  cb: DatasourceChangeListener,
  subscriptionId: string,
  startTime?: number,
  endTime?: number
) {
 

  console.log("Subscriber:", subscriber);
  console.log("Callback Function:", cb);
  console.log("Subscription ID:", subscriptionId);
  console.log("Start Time:", startTime);
  console.log("End Time:", endTime);
  // console.log("Logged In User:", loggedInUser);
  
  if (dealingPanelListeners.has(subscriptionId)) return;
  const loggedInUser = "101"
  if (!loggedInUser) return;
  const time: { subscriptionId: string; startTime?: number; endTime?: number } =
    { subscriptionId: subscriptionId };

  if (startTime !== undefined) {
    time.startTime = startTime;
  }

  if (endTime !== undefined) {
    time.endTime = endTime;
  }

  console.log("me  kakk")
  subscribeDealingPanel(subscriber, loggedInUser, time);
// LoginDevicePanel(loggedInUser, time)
  dealingPanelListeners.set(subscriptionId, cb);
}

export function deregisterDealingPanel(
  subscriber: DataSourceSubscriber,
  subscriptionId: string
) {
  const loggedInUser = localStorage.getItem("loginUser");
  if (dealingPanelListeners.has(subscriptionId) && loggedInUser) {
    dealingPanelListeners.delete(subscriptionId);
  }
}


export const deregisterDataStream = () => {
  // Functionality for deregistering data stream
};

export const fetchInsertData = () => {
  // Functionality for fetching insert data
};



// Fetching LoGIN_DATA_INTERVAL
  // Start


  export function registerLoginDevicePanel(
    subscriber: LoginPanelSubscriber,
    startTime?: number,
    endTime?: number
  ) {
    const time: { startTime?: number; endTime?: number } = {};
  
    if (startTime !== undefined) {
      time.startTime = startTime;
    }
  
    if (endTime !== undefined) {
      time.endTime = endTime;  
    }
    
    LoginDevicePanel(subscriber, time);
    LoginPanelListeners.set(subscriber, time); // Corrected typo in `LoginPanelListeners`
  }
  
  
  export function deregisterLoginDevicePanel(
    subscriber: LoginPanelSubscriber,
    subscriptionId: string
  ) {
    const loggedInUser = localStorage.getItem("loginUser");
    if (LoginPannelListeners.has(subscriptionId) && loggedInUser) {
      LoginPannelListeners.delete(subscriptionId);
    }
  }
  

// END 

export function updateDealingPanelSubscription(
  subscriber: LoginPanelSubscriber,
  subscriptionId: string,
  startTime?: number,
  endTime?: number
) {
  const loggedInUser = localStorage.getItem("loginUser");
  if (dealingPanelListeners.has(subscriptionId) && subscriber && loggedInUser) {
    const request = FetchDealingDataInterval.FetchDealingDataInterval.fromObject({
      type: "DEALING_PANEL_TIME_CHANGED",
      loginUser: loggedInUser,
      subscriptionId: subscriptionId
    });
  
    if (startTime !== undefined) {
      request.startTime = startTime;
    }
    if (endTime !== undefined) {
      request.endTime = endTime;
    }
    const clientMessage= new ClientMessage.ClientMessage();
    clientMessage.fetchDealingdatainterval = request;
    const buf = clientMessage.serializeBinary();
    // //debugger
    sendMessage(buf);    
  }
}




//

export function updateLoginPanelSubscription(
  subscriber: DataSourceSubscriber,
  subscriptionId: string,
  startTime?: number,
  endTime?: number
) {
  const loggedInUser = localStorage.getItem("loginUser");
  if (LoginPannelListeners.has(subscriptionId) && subscriber && loggedInUser) {
    const request = FetchLoginDevice.FetchLoginDevice.fromObject({
      type: "LOGIN_DEVICE_PANEL_TIME_CHANGED",
      loginUser: loggedInUser,
      subscriptionId: subscriptionId
    });
  
    if (startTime !== undefined) {
      request.startTime = startTime;
    }
    if (endTime !== undefined) {
      request.endTime = endTime;
    }
    const clientMessage= new ClientMessage.ClientMessage();
    clientMessage.FetchLoginDevice = request;
    const buf = clientMessage.serializeBinary();
    // //debugger
    sendMessage(buf);    
  }
}


export function setActiveColumnsForDataSource(
  subscriber: DataSourceSubscriber,
  columns: string[]
) {
  const loggedInUser = localStorage.getItem("loginUser");
  if (subscriber && loggedInUser) {
    const request = ActiveColumnChanged.ActiveColumnChanged.fromObject({
      type: "ACTIVE_COLUMNS_CHANGED",
      requestType: subscriber.subscribeEvent,
      columns,
      loginUser: loggedInUser,
    });
    //debugger
    const clientMessage= new ClientMessage.ClientMessage();
    clientMessage.activecolumnchagerequest = request;
    const buf = clientMessage.serializeBinary();
    websocket.sendMessage(buf);
  }
}

export function fetchAddWidgetMetaData(dispatch: Dispatch<any>) {
  return dispatch({
    type: ReducerConstants.FETCH_ADD_WIDGET_META_DATA,
  });
}

export function onDateChange(time: number) {
  const request = FetchClientPositions.FetchClientPositions.fromObject({
    type: ReducerConstants.FETCH_CLIENT_POSITIONS_PRENETQTY,
    time: time,
    action: "refresh",
  });
  const clientMessage= new ClientMessage.ClientMessage();
  clientMessage.fetchclientposition = request;
  const buf = clientMessage.serializeBinary();
  return sendMessage(buf);
}

export function openCustomWidgetAddModal(flag: boolean) {
  return {
    type: ReducerConstants.OPEN_CUSTOM_ADD_WIDGET_DIALOG,
    addCustomWidgetPopUpDialog: flag ?? true,
  };
}

export function openAddWidgetModal(flag: boolean) {
  return {
    type: ReducerConstants.OPEN_ADD_WIDGET_DIALOG,
    addWidgetPopUpDialog: flag ?? true,
  };
}

export function toggleTdhModal(open: boolean) {
  return {
    type: ReducerConstants.OPEN_TDH_MODAL,
    open,
  };
}
export function clearMessage() {
  return {
    type: ReducerConstants.CLEAR_MESSAGE,
  };
}
export function executeTdh(tdhData: TdhData) {
  const request = TdhExecution.TdhExecution.fromObject({type: ReducerConstants.EXECUTE_TDH, buyLogin: [tdhData.buyLogin],buyRate: tdhData.buyRate, buySymbol: tdhData.buySymbol, executionType: tdhData.executionType, sellLogin: [tdhData.sellLogin], sellRate: tdhData.sellRate, sellSymbol: tdhData.sellSymbol  });
  const clientMessage= new ClientMessage.ClientMessage();
  clientMessage.tdhexecution = request;
  clientMessage.type = ReducerConstants.EXECUTE_TDH;
  const buf = clientMessage.serializeBinary();
  const des = ClientMessage.ClientMessage.deserialize(buf);
  console.log("des1   : ",des.toObject());
  websocket.sendMessage(buf);
  // sendMessage(buf);                
}
export function toggleSymbolMarginModal(open: boolean, dispatch: Dispatch) {
  return dispatch({
    type: ReducerConstants.OPEN_SYMBOL_MARGIN_MODAL,
    open,
  });
}
export function fetchClientsAndSymbol() {
  const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.FETCH_LOGIN_AND_SYMBOL)
  websocket.sendMessage(buf);
}
export function toggleHighLowMisMatchModal(open: boolean, dispatch: Dispatch) {
  return dispatch({
    type: ReducerConstants.OPEN_HIGH_LOW_MISMATCH_MODAL,
    open,
  });
}
export function fetchHighLowMisMatchData(date: string) {
  const request = FetchHighLowMismatchData.FetchHighLowMismatchData.fromObject({type: ReducerConstants.FETCH_HIGH_LOW_MISMATCH_DATA, date: date});
  const clientMessage= new ClientMessage.ClientMessage();
  clientMessage.fetchhighlowmismatchdata = request;
  clientMessage.type = ReducerConstants.FETCH_HIGH_LOW_MISMATCH_DATA;
  const buf = clientMessage.serializeBinary();
  websocket.sendMessage(buf);
}
export function toggleCustomizeWidgetModal(open: boolean) {
  return {
    type: ReducerConstants.TOGGLE_CUSTOMIZE_WIDGET_MODAL,
    open,
  };
}

export function fetchTemplates() {
  const loggedInUser = localStorage.getItem("loginUser");
  if (loggedInUser) {
    const request = FetchColorTemplates.FetchColorTemplates.fromObject({
      type: ReducerConstants.FETCH_COLOR_TEMPLATES,
      loginUser: loggedInUser,
    });
    const clientMessage= new ClientMessage.ClientMessage();
    clientMessage.fetchcolortemplates = request;
    const buf = clientMessage.serializeBinary();
    websocket.sendMessage(buf);
  }
}

export function fetchThemes() {
  const loggedInUser = localStorage.getItem("loginUser");
  if (loggedInUser) {
    const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.FETCH_COLOR_THEMES, loggedInUser)
    websocket.sendMessage(buf);
  }
}

export function turnOnOffColor(flag: boolean = false) {
  return {
    type: ReducerConstants.COLOR_ENABLE,
    isColorOn: flag,
  };
}

export function toggleOpenColorTemplateState(flag: boolean = false) {
  return {
    type: ReducerConstants.OPEN_COLOR_TEMPLATE_MODAL,
    openColorTemplateState: flag,
  };
}

export function setSelectedTheme(theme: Theme | undefined) {
  if (theme) {
    return {
      type: ReducerConstants.SET_SELECTED_THEME,
      selectedTheme: theme,
    };
  } else {
    return {
      type: ReducerConstants.SET_SELECTED_THEME,
      selectedTheme: themes[0],
    };
  }
}

export function saveTemplate(data: any, id: string) {
  const loggedInUser = localStorage.getItem("loginUser");
  if (loggedInUser && id) {
    const request = SaveColorTemplate.SaveColorTemplate.fromObject({
      type: ReducerConstants.SAVE_COLOR_TEMPLATE,
      template: data,
      loginUser: loggedInUser,
    });
    const clientMessage= new ClientMessage.ClientMessage();
    clientMessage.saveColorTemplate = request;
    const buf = clientMessage.serializeBinary();
    websocket.sendMessage(buf);
  }
}

export function saveTheme(data: any, id: string) {
  const loggedInUser = localStorage.getItem("loginUser");
  if (loggedInUser && id) {
    const request = SaveColorTheme.SaveColorTheme.fromObject({
      type: ReducerConstants.SAVE_COLOR_THEME,
      loginUser: loggedInUser,
      theme: data
    });
    const clientMessage= new ClientMessage.ClientMessage();
    clientMessage.savecolortheme = request;
    const buf = clientMessage.serializeBinary();
    websocket.sendMessage(buf);
  }
}

export function deleteTemplate(id: string) {
  const loggedInUser = localStorage.getItem("loginUser");
  if (loggedInUser && id) {
    const request = DeleteTemplate.DeleteTemplate.fromObject({
      type: ReducerConstants.DELETE_TEMPLATE,
      id: id,
      loginUser: loggedInUser,
    });
    const clientMessage= new ClientMessage.ClientMessage();
    clientMessage.deletetemplate = request;
    const buf = clientMessage.serializeBinary();
    websocket.sendMessage(buf);
  }
}

export function deleteTheme(id: string) {
  const loggedInUser = localStorage.getItem("loginUser");
  if (loggedInUser && id) {
    const request = DeleteColorTheme.DeleteColorTheme.fromObject({
      type: ReducerConstants.DELETE_COLOR_THEME,
      id: id,
      loginUser: loggedInUser,
    });
    const clientMessage= new ClientMessage.ClientMessage();
    clientMessage.deletecolortheme = request;
    const buf = clientMessage.serializeBinary();
    websocket.sendMessage(buf);
  }
}

export function toogleAddPageModal(open: boolean) {
  return {
    type: ReducerConstants.TOGGLE_ADD_PAGE_MODAL,
    open,
  };
}
export function setActiveTabSet(tabSetId: string | undefined) {
  return {
    type: ReducerConstants.SET_ACTIVE_TAB_SET,
    tabSetId,
  };
}
export function fetchAccountPanelMetaData() {
  const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.FETCH_ACCOUNT_PANEL_META_DATA)
  sendMessage(buf);
}
export function fetchBrokerPanelMetaData() {
  const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.FETCH_BROKER_PANEL_META_DATA)
  sendMessage(buf);
}
export function fetchSubBrokerPanelMetaData() {
  const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.FETCH_SUBBROKER_PANEL_META_DATA)
  sendMessage(buf);
}
export function fetchDealingPanelMetaData() {
  // //debugger
  const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.FETCH_DEALING_PANEL_META_DATA)
  sendMessage(buf);
}
export function fetchOrderPanelMetaData() {
  const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.FETCH_ORDER_PANEL_META_DATA)
  sendMessage(buf);
}

// My Code 
export function fetchHlogindevicelog(){
  //debugger
  const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.FETCH_LOGIN_DEVICE_LOG)
  sendMessage(buf);
}


export function activateOrder() {
  const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.ACTIVATE_ORDER);
  sendMessage(buf);
}
export function setAlertMessage(message: string, messageType: string) {
  return {
    type: ReducerConstants.SET_ALERT_MESSAGE,
    message,
    messageType,
  };
}
export function logout() {
  return {
    type: ReducerConstants.LOGOUT_USER,
  };
}
export function fetchSelectedTheme() {
  const loginUser = localStorage.getItem("loginUser");
  if (!loginUser) return;
  const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.FETCH_SELECTED_THEME, loginUser);
  sendMessage(buf);
}
