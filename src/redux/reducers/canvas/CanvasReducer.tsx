import { AnyAction } from "redux";
import { ReducerConstants } from "../../../config/reducers/ReducerConstants";
import initialState from '../../../config/reducers/ReducerInitialState';
import CanvasFactory, { DefaultCanvasModel } from '../../../ui/canvas/services/CanvasService';
// import { CanvasState, getInitialStateForGlobalFilters } from '../../../ui/canvas/CanvasContainer';
import { linkColors } from '../../../ui/components/common/widget-link/WidgetLink';
import { cloneDeep } from "lodash";
import ReducerInitialState from "../../../config/reducers/ReducerInitialState";



export type DataColumnGroup = {
    key:string;
    displayValue:string;
    dataType:string;
    size:number;
    editable:boolean;
    isCurrency:boolean;
    shouldAnimate:boolean;
    groupingEnabled:boolean;
    pivotEnabled:boolean;
    calculateTotal:boolean;
    groupingColumns:DataColumn[]
}
export type DataColumn = {
    headerName:string;
    field:string;
    dataType:string;
    enableValue:boolean;
    enablePivot:boolean;
    enableRowGroup:boolean;
    decimalLocator?:number;
    minWidth?:number;
    width:number;
    editable:boolean;
    inputControl?:string;
    enableCheckboxSelection?:boolean;
}
export type DataSourceType = {
    id:string,
    name:string,
    tableName?:string;
    subscribeEvent:string,
    unsubscribeEvent:string,
    listenEvent:string,
    isLive:boolean,
    columns: (DataColumnGroup | DataColumn)[],
    uniqueKey: string[]
}

export const dataSources:DataSourceType[] = [
    {
        name:'Account Panel',
        id:'account-panel',
        tableName:"Orika_clientmaster",
        subscribeEvent:"FETCH_CLIENTDATA",
        unsubscribeEvent:"",
        listenEvent:"CLIENTDATA",
        uniqueKey:["login"],
        isLive:false,
        columns:[
            {
                headerName:"Login",
                field:"login",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                editable:false
            },
            {
                headerName:"Name",
                field:"name",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                editable:true
            },
            {
                headerName:"Broker",
                field:"broker",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                editable:false
            },
            {
                headerName:"SubBroker",
                field:"subbroker",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                editable:false
            },
            {
                headerName:"Extra Group",
                field:"extragroup",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                editable:false
            },
            
            {
                headerName:"Loss Limit",
                field:"losslimit",
                dataType:"double",
                size:50,
                enableValue:true,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                editable:true
            },
            {
                headerName:"Credit Limit",
                field:"creditlimit",
                dataType:"double",
                size:50,
                enableValue:true,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                editable:true
            },
            {
                headerName:"Comment",
                field:"comment",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                editable:true
            },
            {
                headerName:"Qty Limit Multiplyer",
                field:"qtylimitmultiplayer",
                dataType:"double",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                editable:true
            },
            {
                headerName:"Ignore Trader",
                field:"ignoretrader",
                dataType:"double",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                editable:true
            },
            {
                headerName:"Colour",
                field:"colour",
                dataType:"double",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                editable:false
            },
            {
                headerName:"Company",
                field:"company",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                editable:false
            },
            {
                headerName:"LP Ratio",
                field:"lpratio",
                dataType:"double",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                editable:false
            },
            
            
            
        ]
    },
    {
        name:'Broker Panel',
        id:'broker-panel',
        tableName:"orika_broker",
        subscribeEvent:'FETCH_BROKERDATA',
        unsubscribeEvent:'',
        listenEvent:'BROKERDATA',
        uniqueKey:['broker'],
        isLive:false,
        columns:[
            {
                headerName:"Broker",
                field:"broker",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:false,
                enableRowGroup:false,
                width:150,
                inputControl:'textbox',
                decimalLocator:0,
                editable:false,
            },
            {
                headerName:"Max Brokerage",
                field:"maxbrokerage",
                dataType:"double",
                size:50,
                enableValue:false,
                enablePivot:false,
                enableRowGroup:false,
                width:150,
                inputControl:'textbox',
                decimalLocator:0,
                editable:true
            }
        ]
    },
    {
        name:'SubBroker Panel',
        id:'subbroker-panel',
        subscribeEvent:'FETCH_SUBBROKERDATA',
        unsubscribeEvent:'',
        listenEvent:'SUBBROKERDATA',
        tableName:"orika_subbroker",
        uniqueKey:['subbroker'],
        isLive:false,
        columns:[
            {
                headerName:"SubBroker",
                field:"subbroker",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:false,
                enableRowGroup:false,
                width:150,
                inputControl:'textbox',
                decimalLocator:0,
                editable:false,
            },
            {
                headerName:"Max Brokerage",
                field:"maxbrokerage",
                dataType:"double",
                size:50,
                enableValue:false,
                enablePivot:false,
                enableRowGroup:false,
                width:150,
                inputControl:'textbox',
                decimalLocator:0,
                editable:true
            }
        ]
    },
    {
        name:'Dealing Panel',
        id:'dealing-panel',
        subscribeEvent:'FETCH_DEALING_DATA',
        unsubscribeEvent:'FETCH_DEALING_DATA',
        listenEvent:'DEALING_DATA',
        uniqueKey:["id"],
        isLive:false,
        columns:[
            {
                headerName:"Id",
                field:"id",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                decimalLocator:0,
                editable:false,
            },
            {
                headerName:"Time",
                field:"time",
                dataType:"datetime",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                decimalLocator:0,
                editable:false,
            },
            {
                headerName:"Login",
                field:"login",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                decimalLocator:0,
                editable:false,
            },
            {
                headerName:"Symbol",
                field:"symbol",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                decimalLocator:0,
                editable:false,
            },
            {
                headerName:"Volume",
                field:"volume",
                dataType:"double",
                size:50,
                enableValue:true,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                decimalLocator:4,
                editable:false,
            },
            {
                headerName:"Buy/Sell",
                field:"buysell",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                editable:false,
            },
            {
                headerName:"Price",
                field:"price",
                dataType:"double",
                size:50,
                enableValue:true,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                decimalLocator:4,
                editable:false,
            },
            {
                headerName:"Reason",
                field:"reason",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                decimalLocator:0,
                editable:false,
            },
            {
                headerName:"Type",
                field:"dealingtype",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:130,
                decimalLocator:0,
                editable:false,
            }
        ]
    },
    {
        name:'Login device panel',
        id:'login-device-panel',
        subscribeEvent:'FETCH_LOGIN_DEVICE_LOG',
        unsubscribeEvent:'FETCH_LOGIN_DEVICE_LOG',
        listenEvent: 'LOGIN_DEVICE_LOG',
        uniqueKey:["id"],
        isLive:false,
        columns:[
           
            {
                headerName:"Time",
                field:"time",
                dataType:"datetime",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                decimalLocator:0,
                editable:false,
            },
            {
                headerName:"ip",
                field:"ip",
                dataType:"datetime",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                decimalLocator:0,
                editable:false,
            },
            {
                headerName:"Login",
                field:"login",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                decimalLocator:0,
                editable:false,
            },
            {
                headerName:"Device Id",
                field:"deviceid",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:130,
                decimalLocator:0,
                editable:false,
            }
        ]
    },
    {
        name:'Dealing Panel Interval',
        id:'dealing-panel-interval',
        subscribeEvent:'FETCH_DEALING_DATA_INTERVAL',
        unsubscribeEvent:'FETCH_DEALING_DATA_INTERVAL',
        listenEvent: 'DEALING_DATA_INTERVAL',
        uniqueKey:["id"],
        isLive:false,
        columns:[
            {
                headerName:"Id",
                field:"id",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                decimalLocator:0,
                editable:false,
            },
            {
                headerName:"Time",
                field:"time",
                dataType:"datetime",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                decimalLocator:0,
                editable:false,
            },
            {
                headerName:"Login",
                field:"login",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                decimalLocator:0,
                editable:false,
            },
            {
                headerName:"Symbol",
                field:"symbol",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                decimalLocator:0,
                editable:false,
            },
            {
                headerName:"Volume",
                field:"volume",
                dataType:"double",
                size:50,
                enableValue:true,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                decimalLocator:4,
                editable:false,
            },
            {
                headerName:"Buy/Sell",
                field:"buysell",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                editable:false,
            },
            {
                headerName:"Price",
                field:"price",
                dataType:"double",
                size:50,
                enableValue:true,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                decimalLocator:4,
                editable:false,
            },
            {
                headerName:"Reason",
                field:"reason",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:100,
                decimalLocator:0,
                editable:false,
            },
            {
                headerName:"Type",
                field:"dealingtype",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:130,
                decimalLocator:0,
                editable:false,
            }
        ]
    },
    {
        name: "Client Position Live",
        id:"client-position-live",
        subscribeEvent: "FETCH_CLIENT_POSITIONS",
        unsubscribeEvent: "FETCH_CLIENT_POSITIONS_STOP",
        listenEvent: "CLIENT_POSITION",
        isLive:true,
        columns: [],
        uniqueKey: ['login', 'symbol'],
    },
    {
        id:"order-panel",
        name:"Order Panel",
        isLive:false,
        subscribeEvent:"FETCH_ORDER_DATA",
        listenEvent:"ORDER_DATA",
        unsubscribeEvent:"FETCH_ORDER_DATA",
        uniqueKey:["order"],
        tableName:"orika_order",
        columns:[
            {
                "key": "D_Order",
                "displayValue": "Order",
                "dataType": "string",
                "size": 20,
                "editable": false,
                "calculateTotal": false,
                "groupingEnabled": false,
                "isCurrency": true,
                "shouldAnimate": false,
                "pivotEnabled": false,
                "groupingColumns": [
                    {
                        "headerName": "Order",
                        "field": "order",
                        "width": 100,
                        "enableRowGroup": false,
                        "enablePivot": false,
                        "enableValue": true,
                        "decimalLocator": 0,
                        "dataType": "string",
                        "editable": false,
                        "enableCheckboxSelection":true
                    },
                    {
                        "headerName": "Login",
                        "field": "login",
                        "width": 100,
                        "enableRowGroup": false,
                        "enablePivot": false,
                        "enableValue": true,
                        "decimalLocator": 0,
                        "dataType": "string",
                        "editable": false,
                    },
                    {
                        "headerName": "Order Time",
                        "field": "time",
                        "width": 100,
                        "enableRowGroup": true,
                        "enablePivot": true,
                        "enableValue": false,
                        "decimalLocator": 0,
                        "dataType": "datetime",
                        "editable": false,
                    },
                    {
                        "headerName": "Deal",
                        "field": "deal",
                        "width": 100,
                        "enableRowGroup": false,
                        "enablePivot": false,
                        "enableValue": true,
                        "decimalLocator": 0,
                        "dataType": "int",
                        "editable": false,
                    },
                    {
                        "headerName": "Symbol",
                        "field": "symbol",
                        "width": 100,
                        "enableRowGroup": true,
                        "enablePivot": true,
                        "enableValue": false,
                        "decimalLocator": 0,
                        "dataType": "string",
                        "editable": false,
                    },
                    {
                        "headerName": "Order Type",
                        "field": "type",
                        "width": 100,
                        "enableRowGroup": true,
                        "enablePivot": true,
                        "enableValue": false,
                        "decimalLocator": 0,
                        "dataType": "string",
                        "editable": false,
                    },
                    {
                        "headerName": "Volume",
                        "field": "volume",
                        "width": 100,
                        "enableRowGroup": false,
                        "enablePivot": false,
                        "enableValue": true,
                        "decimalLocator": 2,
                        "dataType": "double",
                        "editable": false,
                    },
                    {
                        "headerName": "Order Price",
                        "field": "price",
                        "width": 100,
                        "enableRowGroup": false,
                        "enablePivot": false,
                        "enableValue": true,
                        "decimalLocator": 4,
                        "dataType": "double",
                        "editable": false,
                    },
                    {
                        "headerName": "Comment",
                        "field": "comment",
                        "width": 100,
                        "enableRowGroup": true,
                        "enablePivot": true,
                        "enableValue": false,
                        "decimalLocator": 0,
                        "dataType": "string",
                        "editable": false,
                    },
                    {
                        "headerName": "Status",
                        "field": "status",
                        "width": 100,
                        "enableRowGroup": true,
                        "enablePivot": true,
                        "enableValue": false,
                        "decimalLocator": 0,
                        "dataType": "string",
                        "editable": false,
                    },
                    {
                        "headerName": "Status Type",
                        "field": "statustype",
                        "width": 100,
                        "enableRowGroup": true,
                        "enablePivot": true,
                        "enableValue": false,
                        "decimalLocator": 0,
                        "dataType": "string",
                        "editable": true,
                    },
                    {
                        "headerName": "Status SubType",
                        "field": "subtype",
                        "width": 100,
                        "enableRowGroup": true,
                        "enablePivot": true,
                        "enableValue": false,
                        "decimalLocator": 0,
                        "dataType": "string",
                        "inputControl": "combobox",
                        "editable": true,
                    },
                    {
                        "headerName": "Contra Order",
                        "field": "contraorder",
                        "width": 100,
                        "enableRowGroup": false,
                        "enablePivot": false,
                        "enableValue": true,
                        "decimalLocator": 0,
                        "dataType": "int",
                        "editable": true,
                    },
                    {
                        "headerName": "Trade Execute Time",
                        "field": "tradeexecutetime",
                        "width": 100,
                        "enableRowGroup": false,
                        "enablePivot": false,
                        "enableValue": true,
                        "decimalLocator": 0,
                        "dataType": "int",
                        "editable": true,
                    },
                    {
                        "headerName": "Our Comment",
                        "field": "ourcomment",
                        "width": 100,
                        "enableRowGroup": true,
                        "enablePivot": true,
                        "enableValue": false,
                        "decimalLocator": 0,
                        "dataType": "string",
                        "editable": true,
                    },
                    {
                        "headerName": "Order State",
                        "field": "orderstate",
                        "width": 100,
                        "enableRowGroup": true,
                        "enablePivot": true,
                        "enableValue": false,
                        "decimalLocator": 0,
                        "dataType": "string",
                        "editable": false,
                    }
                ]
            }
        ]
    },
    {
        id:"tick-data",
        name:"Tick Data",
        isLive:true,
        subscribeEvent:"FETCH_TICK_DATA",
        listenEvent:"TICK_DATA",
        unsubscribeEvent:"FETCH_TICK_DATA",
        uniqueKey:["symbol"],
        columns:[
            {
                headerName:"Symbol",
                field:"symbol",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:true,
                width:150,
                editable:false,
            },
            {
                headerName:"Bid",
                field:"bid",
                dataType:"double",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                editable:false
            },
            {
                headerName:"Ask",
                field:"ask",
                dataType:"double",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                editable:false
            },
            {
                headerName:"Last",
                field:"last",
                dataType:"double",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                editable:false
            },
            {
                headerName:"Open",
                field:"open",
                dataType:"double",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                editable:false
            },
            {
                headerName:"High",
                field:"high",
                dataType:"double",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                editable:false
            },
            {
                headerName:"Low",
                field:"low",
                dataType:"double",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                editable:false
            },
            {
                headerName:"Close",
                field:"close",
                dataType:"double",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                editable:false
            },
            {
                headerName:"Tick Time",
                field:"ticktime",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:false,
                width:160,
                editable:false
            },
            {
                headerName:"Change",
                field:"change",
                dataType:"double",
                size:50,
                decimalLocator:2,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                editable:false
            },
            {
                headerName:"Delete",
                field:"delete",
                dataType:"string",
                size:50,
                enableValue:false,
                enablePivot:true,
                enableRowGroup:false,
                width:100,
                editable:false
            }
            
        ]
    }
]
const canvasServiceInstance = CanvasFactory.getInstance();
export default function CanvasReducer(state = initialState?.canvas, action: AnyAction) {
    switch (action.type) {
        case ReducerConstants.SET_ACTIVE_TAB_SET: {
            return {
                ...state,
                activeTabSet:action.tabSetId
            }
        }
        case ReducerConstants.SET_CANVAS_MODEL: {
            return {
                ...state,
                canvasModel:action.canvasModel
            }
        }
        case ReducerConstants.RESET_CANVAS_STATE: {
            return {
                ...state,
                activeTabSet:undefined,
                // filters:getInitialStateForGlobalFilters(),
                filterColor:linkColors[0],
                canvasModel: null,
            }
        }
        case ReducerConstants.PAGE_DETAILS: {
            try{
                const canvas = JSON.parse(action.page.layout);
                const widgetProps = JSON.parse(action.page.widgetConfigs);
                canvasServiceInstance.addAllWidgetsToPage(action.page.pageId,widgetProps);
                return canvas;
            }catch(error) {
                console.error("error in page: ",action);
                // const canvas: "CanvasState = {...ReducerInitialState.canvas};"
                // canvas.canvasModel = "DefaultCanvasModel";
                return null;
            }
        }
        case ReducerConstants.SET_CANVAS_FILTERS:{
            return {
                ...state,
                filters:action.filters
            }
        }
        case ReducerConstants.SET_CANVAS_FILTER_COLOR:{
            return {
                ...state,
                filterColor:action.filterColor
            }
        }
        default:
            return state;

    }
}

function getCanvasComponent(tempDataSources: any, tempCanvas: any): any {

    var sendDataUpdate = false;

    tempCanvas["reference_components"].forEach((item: any) => {
        var datasourceItemFound = tempDataSources.filter((datasourceItem: any) => datasourceItem.name === item.details.datasource.name)
        if (datasourceItemFound != undefined) {
            item.details.datasource = cloneDeep(datasourceItemFound[0])
            item.details.columnDefs = item.details.datasource.columns;
            if (item.details.columnDefs != undefined) {
                sendDataUpdate = true;
            }
            if (item.details.datasource.uniqueKey != undefined) {
                item.details.uniqueKey = [...item.details.datasource.uniqueKey];
            } else {
                item.details.uniqueKey = ['login', 'symbol']
            }

            item.details.columnDefs.forEach((columnItem: any) => {
                columnItem.groupingColumns.forEach((element: any) => {
                    element.hide = true;
                    element.rowGroup = false;
                    element.aggFunc = undefined;

                    var checkIsExists = item.details.group_by.filter((groupByItem: string) => groupByItem === element.field);
                    if (checkIsExists != undefined && checkIsExists.length > 0) {
                        element.rowGroup = true;
                    }

                    checkIsExists = item.details.visible_cols.filter((visibleItem: string) => visibleItem === element.field);
                    if (checkIsExists != undefined && checkIsExists.length > 0) {
                        element.hide = false;
                    }

                    checkIsExists = item.details.function_cols[element.field];
                    if (checkIsExists != undefined) {
                        element.aggFunc = checkIsExists;
                        element.hide = false;
                    }
                });
            })
        }
    })
    if (sendDataUpdate)
        return tempCanvas;
    else
        return undefined;
}