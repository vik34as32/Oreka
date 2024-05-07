import { AnyAction } from "redux";
import { ReducerConstants } from "../../../config/reducers/ReducerConstants";
import initialState from '../../../config/reducers/ReducerInitialState';
import { themes } from '../../../data/colorTemplate';
// import { HeaderTabs } from '../../../models/HeaderModel';
import { DataColumn, DataColumnGroup, dataSources } from "../canvas/CanvasReducer";
import { getBufferDataForFetchLoginUserWiseDataRequest, sendMessage } from '../../action-handlers/app/AppActions';
import { Oreka as ClientMessage } from "../../../proto/clientmessage";
// import { Oreka as SetSelectedTheme } from "../../../proto/SetSelectedTheme";

const headers = [] as HeaderTabs[]
const homeHeader = {
    name: "Home",
    id: 1
} as HeaderTabs
const secondHeader = {
    name: "Second test",
    id: 1
} as HeaderTabs
const thirdHeader = {
    name: "Test D",
    id: 1
} as HeaderTabs
const forthHeader = {
    name: "Testd",
    id: 1
} as HeaderTabs
const fifthHeader = {
    name: "te",
    id: 1
} as HeaderTabs
const sixHeader = {
    name: "six",
    id: 1
} as HeaderTabs
const sevenHeader = {
    name: "se",
    id: 1
} as HeaderTabs
headers.push(homeHeader);
headers.push(secondHeader);
headers.push(thirdHeader);
headers.push(forthHeader);
headers.push(fifthHeader);
headers.push(sixHeader);
headers.push(sevenHeader);


const addWidgetJson = [
    {
        "name": "Ag Grid",
        "child": [
            {
                "name": "Live",
                "child": [
                    {
                        "name": "FloatingP&L Live",
                        "details": {
                            "component": "grid",
                            "datasource": {
                                'name': "Client Position Live"
                            },
                            "group_by": [
                                "login",
                                "symbol",
                            ],
                            "visible_cols": [
                                "clientfloatingpl",
                                "brokerfloatingpl",
                                "subbrokerfloatingpl",
                                "companyfloatingpl"
                            ],
                            "function_cols": {
                                "clientfloatingpl": "sum",
                                "brokerfloatingpl": "sum",
                                "subbrokerfloatingpl": "sum",
                                "companyfloatingpl": "sum"
                            },
                            "color_by": ["symbol"],
                            "split_by": [

                            ],
                            "filter_by": [

                            ],
                            "filter_drop_down_color": "unlink"
                        }
                    },
                    {
                        "name": "Volume by Login and Symbol",
                        "details": {
                            "component": "grid",
                            "datasource": {
                                'name': "Client Position Live"
                            },
                            "group_by": [
                                "login",
                                "symbol",
                            ],
                            "visible_cols": [
                                "previousvolume",
                                "difference",
                                "clientvolume",
                                "companyvolume"
                            ],
                            "function_cols": {
                                "previousvolume": "sum",
                                "difference": "sum",
                                "clientvolume": "sum",
                                "companyvolume": "sum"
                            },
                            "color_by": ["symbol"],
                            "split_by": [

                            ],
                            "filter_by": [

                            ],
                            "filter_drop_down_color": "unlink"
                        }
                    },
                    {
                        "name": "Volume by broker,subbroker, symbol and login",
                        "details": {
                            "component": "grid",
                            "datasource": {
                                'name': "Client Position Live"
                            },
                            "group_by": [
                                "broker",
                                "subbroker",
                                "symbol",
                                "login"
                            ],
                            "visible_cols": [
                                "previousvolume",
                                "difference",
                                "clientvolume",
                                "companyvolume"
                            ],
                            "function_cols": {
                                "previousvolume": "sum",
                                "difference": "sum",
                                "clientvolume": "sum",
                                "companyvolume": "sum"
                            },
                            "color_by": ["symbol"],
                            "split_by": [

                            ],
                            "filter_by": [

                            ],
                            "filter_drop_down_color": "unlink"
                        }
                    },
                    {
                        "name": "Volume by subbroker, symbol, login",
                        "details": {
                            "component": "grid",
                            "datasource": {
                                'name': "Client Position Live"
                            },
                            "group_by": [
                                "subbroker",
                                "symbol",
                                "login"
                            ],
                            "visible_cols": [
                                "previousvolume",
                                "difference",
                                "clientvolume",
                                "companyvolume"
                            ],
                            "function_cols": {
                                "previousvolume": "sum",
                                "difference": "sum",
                                "clientvolume": "sum",
                                "companyvolume": "sum"
                            },
                            "color_by": ["symbol"],
                            "split_by": [

                            ],
                            "filter_by": [

                            ],
                            "filter_drop_down_color": "unlink"
                        }
                    },
                    {
                        "name": "Orders Live",
                        "details": {
                            "component": "grid",
                            "datasource": {
                                'name': "Orders Live"
                            },
                            "group_by": [
                            ],
                            "visible_cols": [
                                "time",
                                "deal",
                                "order",
                                "symbol",
                                "type",
                                "volume",
                                "price",
                                "comment"
                            ],
                            "function_cols": {
                            },
                            "color_by": ["symbol"],
                            "split_by": [

                            ],
                            "filter_by": [

                            ],
                            "filter_drop_down_color": "unlink"
                        }
                    }
                ]
            },
            {
                "name": "External",
                "child": [

                ]
            },
            {
                "name": "Internal",
                "child": [

                ]
            },
        ]
    }
]
function setClientPositionMetaData(dataSourceId:string,metaData:(DataColumnGroup | DataColumn)[]) {
    const dataSource = dataSources.filter(ds => ds.id === dataSourceId)[0];
    //debugger
    dataSource.columns = metaData;
    const datagroupColKeys:string[] = ["iscurrency","shouldanimate","GroupingEnabled","PivotEnabled","GroupingColumns"];
    const dataChildColKeys:string[] = ["minWidth","inputcontrol"];
    dataSource.columns.forEach(col => {

        Object.assign(col,{"isCurrency":col["iscurrency"],"shouldAnimate":col["shouldanimate"],"groupingEnabled":col["GroupingEnabled"], "pivotEnabled":col["PivotEnabled"], "groupingColumns":col["GroupingColumns"]});
        datagroupColKeys.forEach(key => {
            delete (col as DataColumnGroup)[key];
        });

        (col as DataColumnGroup).groupingColumns.forEach(child => {
            Object.assign(col,{"width":col["minWidth"],"inputControl":col["inputcontrol"]});
            dataChildColKeys.forEach(key => {
                delete child[key];
            });
        });
    })
}
export default function AppReducer(state = initialState?.app, action: AnyAction) {
    console.log(action.type,"ll")
    switch (action.type) {
        case ReducerConstants.clientPositionMetaData: {
            setClientPositionMetaData("client-position-live",action.data);
            return state;
        }
        case ReducerConstants.COLOR_ENABLE:
            return {
                ...state,
                isColorOn : action.isColorOn
            }
        case ReducerConstants.OPEN_COLOR_TEMPLATE_MODAL:
            return {
                ...state,
                openColorTemplateState : action.openColorTemplateState
            }

        case ReducerConstants.COLOR_TEMPLATES:
            return {
                ...state,
                templates : action.templates
            }

        case ReducerConstants.COLOR_THEMES:
            return {
                ...state,
                themes : action.themes
            }
        
        case ReducerConstants.SET_SELECTED_THEME :
            const loginUser = localStorage.getItem('loginUser');
            if(!loginUser) return state;
            // const request = SetSelectedTheme.SetSelectedTheme.fromObject({ type:action.type, theme:action.selectedTheme.id});
            const clientMessage= new ClientMessage.ClientMessage();
            // clientMessage.setselectedtheme = request;
            const buffer = clientMessage.serializeBinary();
            sendMessage(buffer);
            return {
                ...state,
                selectedTheme : action.selectedTheme
            }
        case ReducerConstants.SELECTED_THEME: {
            let selectedTheme;
            if(state.themes.length > 0){
                selectedTheme = state.themes.find(t => t.id === action.theme);
            }
            if(!selectedTheme) selectedTheme = themes[0];
            return {
                ...state,
                selectedTheme
            }
        }
        case ReducerConstants.websocketConnectionStatus:
            return {
                ...state,
                websocketConnectionStatus: action.data
            }
        case ReducerConstants.LoginStatusResponse:
            console.log(action.type,"LoginStatusResponse")
            if(action.status === 'success') localStorage.setItem('loginUser',action.data.id);
            return {
                ...state,
                loginUser: {
                    data: action.data,
                    status: action.status
                }
            }

            case ReducerConstants.TICKDATA:
                console.log(action.type,",,,,")
                return{
                    ...state,
                    tickData:action
                }
    
        case ReducerConstants.LOGOUT_USER:
            localStorage.clear();
            const buf = getBufferDataForFetchLoginUserWiseDataRequest(action.type);
            sendMessage(buf);
            return {
                ...state,
                loginUser: undefined,
            }
        case ReducerConstants.FETCH_ADD_WIDGET_META_DATA:
            return {
                ...state,
                addWidgetMetaData: addWidgetJson
            }
        case ReducerConstants.FetchCanvasMetaData:
            break;
        case ReducerConstants.WebSocketStatusChange:
            return {
                ...state,
                websocketStatus: action.data,
                headers: prepHeaders(headers)
            };
        case ReducerConstants.FetchFingerPrintAction:
            return {
                ...state,
                fingerPrint: action.data,
            };

        case ReducerConstants.OPEN_CUSTOM_ADD_WIDGET_DIALOG:
            return {
                ...state,
                ...action
            }
        case ReducerConstants.OPEN_ADD_WIDGET_DIALOG:
            return {
                ...state,
                ...action
            }
        case ReducerConstants.OPEN_TDH_MODAL:{
            return {
                ...state,
                tdhModalState:action.open             
            }
        }
        case ReducerConstants.SET_ALERT_MESSAGE: {
            return {
                ...state,
                message:{
                    text:action.message,
                    type:action.messageType
                }
            }
        }
        case ReducerConstants.CLEAR_MESSAGE:{
            return {
                ...state,
                message:{
                    ...state.message,
                    text:''
                }
            }
        }
        case ReducerConstants.TDH_RESPONSE_MESSAGE: {
            return {
                ...state,
                message:{
                    type:action.messagetype,
                    text: action.message
                }                
            }
        }
        case ReducerConstants.OPEN_SYMBOL_MARGIN_MODAL:{
            return {
                ...state,
                symbolMarginModalState:action.open,
            }
        }
        case ReducerConstants.OPEN_HIGH_LOW_MISMATCH_MODAL:{
            return {
                ...state,
                highLowMisMatchModalState:action.open,
            }
        }
        case ReducerConstants.HIGH_LOW_MISMATCH_DATA:{
            return {
                ...state,
                highLowMisMatchData:action.data
            }
        }
        case ReducerConstants.TOGGLE_CUSTOMIZE_WIDGET_MODAL:{
            return {
                ...state,
                customizeWidgetModalState:action.open
            }
        }
        case ReducerConstants.LOGIN_AND_SYMBOL: {
            return {
                ...state,
                clientList:action.logins,
                symbolList:action.symbols
            }
        }
        case ReducerConstants.TOGGLE_ADD_PAGE_MODAL: {
            return {
                ...state,
                addPageModalState:action.open
            }
        }
        case ReducerConstants.UPDATE_PAGE_RES: {
            return {
                ...state,
                message:{
                    type:action.success?'success':'error',
                    text:action.message
                }
            }
        }
    }
    return state;
}

function prepHeaders(headers: HeaderTabs[]) {
    headers.forEach(item => {
        var arr = item.name.split(" ")
        var firstChar = ''
        var secondChar = ''
        if (arr.length > 1) {
            var innerArray = arr[0].split('')
            if (innerArray.length > 0) {
                firstChar = innerArray[0].toUpperCase()
            }
            innerArray = arr[1].split('')
            if (innerArray.length > 0) {
                secondChar = innerArray[0].toUpperCase()
            }
        } else {
            var innerArray = arr[0].split('')
            if (innerArray.length > 0) {
                firstChar = innerArray[0].toUpperCase()
            }
            if (innerArray.length > 1) {
                secondChar = innerArray[1].toUpperCase()
            } else {
                secondChar = firstChar
            }
        }
        item.tabIndicatorName = firstChar + secondChar;
    })
    return headers
}