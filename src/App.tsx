// src/App.jsx
import React, { Component, useState,useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { WebSocketConnectionState } from './backend/websocket/WebsocketConnectionState';
import * as appActions from './redux/action-handlers/app/AppActions';

// import { Box } from '@mui/material';
import { Navigate } from 'react-router-dom';
// // import { HeaderTabs } from './models/HeaderModel';
// import { toggleLoginSettingsModal } from './redux/action-handlers/app/SettingAction';
import CanvasPage from './ui/canvas/CanvasPage';
import AddWidgetModal from './ui/components/AddWidgetModal';
import Loader from './ui/components/common/loader/Loader';
import MessageComponent from './ui/components/common/message/MessageComponent';
import HighLowMisMatchModal from './ui/components/popups/highlow-mismatch/HighLowMisMatchModal';
import LoginSettings from './ui/components/popups/login-settings/LoginSettings';
import SymbolMarginModal from './ui/components/popups/symbol-margin/SymbolMarginModal';
import TdhModal from './ui/components/popups/tdh/TdhModal';
import ColorTempleteModal from './ui/components/widgets/ColorTempleteModal';
import {Oreka as LoginByToken} from "./proto/LoginByToken";
import { Oreka as ClientMessage } from "./proto/clientmessage";



const Loginresponse = () => {
    const [user, setUser] = useState();

    useEffect(() => {
        const loginusertype = window.localStorage.getItem("loginusertype");

        if (loginusertype) {
            setUser(loginusertype);
        }
    }, []);
  
    return (
        <div style={{ color: "wheat" }}>
             {user}
        </div>
    );
  }
  

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

type AppState = {
    showAddWidgetModal: boolean,
    showAddWidgetCustomModal: boolean,
}
export const PopoutContext = React.createContext(false);
class App extends Component<Props, AppState> {
    authTokenLogginAttempt:boolean;
    constructor(props: Props) {
        super(props);
        this.authTokenLogginAttempt = false;
        this.state = {
            showAddWidgetModal: false,
            showAddWidgetCustomModal: false,
        }
    }


   

    componentDidMount() {
        if(this.props.websocketStatus === undefined)
            this.props.connectWebSocket();
    }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (nextProps?.loginUser?.status == "success") {
            this.props.fetchHeadersTiles(nextProps?.loginUser?.data.id)
            this.props.fetchMetaData(nextProps?.loginUser?.data.id)
            this.props.fetchClientsAndSymbols();
        }
        return true
    }

    handleAddWidgetModalOpen() {
        this.props.openWidgetAddModal(true);
    }

    handleAddWidgetModalClose() {
        this.props.openWidgetAddModal(false);
    }



    handleAddWidgetCustomModalOpen() {
        this.props.addCustomWidgetDialog(true);
    }

    handleAddWidgetCustomModalClose() {
        this.props.addCustomWidgetDialog(false);
    }
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<AppState>, snapshot?: any): void {
        if(this.props.websocketStatus === WebSocketConnectionState.CONNECTED && !this.authTokenLogginAttempt) {
            const authToken = localStorage.getItem('authToken');           
            if(authToken!==null) {
                this.authTokenLogginAttempt = true;
                const request = LoginByToken.LoginByToken.fromObject({type: "loginbytoken", logintoken: authToken});
                const clientMessage= new ClientMessage.ClientMessage();
                clientMessage.loginbytoken = request;
                const buf = clientMessage.serializeBinary();
                this.props.sendMessage(buf, true);
            }
        }
    }
    render() {
        console.log(this.props.loginUser)
        if(localStorage.getItem('authToken') === null || this.props.loginUser && this.props.loginUser.status !== 'success') {
            return <Navigate to={'/login'} replace/>
        }
        if(!this.props.loginUser) {
            return <Loader size={50} disableShrink={true}/>
        }
        
        return (
            <PopoutContext.Provider value={window.opener !== null}>
                {/* <Box>
                    <CanvasPage/>
                    <AddWidgetModal
                        open={this.props.showAddWidgetModal}
                        handleOpen={() => this.handleAddWidgetModalOpen()} 
                        handleClose={() => this.handleAddWidgetModalClose()}
                        addWidgetMetaData={this.props.addWidgetMetaData}
                    />
                    <MessageComponent/>
                    {this.props.tdhModelState && <TdhModal/>}
                    <SymbolMarginModal/>
                    <HighLowMisMatchModal/>
                    <ColorTempleteModal/>
                    <LoginSettings open={this.props.loginSettingsModalState} onClose={() => this.props.toggleLoginSettingsModal(false,"")}/>
                </Box> */}
                {/* <Loginresponse/> */}
            </PopoutContext.Provider>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        headerTabs: state.app.headerTabs,
        selectedTab: state.app.selectedTab,
        datasources: state.app.datasources,
        websocketStatus: state.app.websocketConnectionStatus,
        loginUser: state.app?.loginUser,
        showAddWidgetModal: state.app?.addWidgetPopUpDialog,
        showAddWidgetCustomModal: state.app?.addCustomWidgetPopUpDialog,
        addWidgetMetaData: state.app?.addWidgetMetaData,
        tdhModelState:state.app.tdhModalState,
        loginSettingsModalState: state.setting.loginSettingsModalState.open
    }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        connectWebSocket: () => appActions.connectWebSocket(dispatch),
        fetchClientsAndSymbols: () => appActions.fetchClientsAndSymbol(),
        fetchHeadersTiles: (id: string) => appActions.fetchHeadersTiles(id),
        fetchMetaData: (id: string) => appActions.fetchMetaData(id),
        addCustomWidgetDialog: (flag: boolean) => appActions.openCustomWidgetAddModal(flag),
        openWidgetAddModal: (flag: boolean) => dispatch(appActions.openAddWidgetModal(flag)),
        sendMessage:(message:any,isHighestPriority?:boolean) => appActions.sendMessage(message,isHighestPriority),
        toggleLoginSettingsModal:(open:boolean,loginValue:string) => dispatch(toggleLoginSettingsModal(open,loginValue))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
