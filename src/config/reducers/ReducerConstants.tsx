export const ReducerConstants = {
    FetchCanvasMetaData: 'FETCH_CLIENT_WISE_NET_POSITION_META_DATA',
    WebSocketStatusChange: 'WebSocketStatusChange',
    websocketConnectionStatus: 'websocketConnectionStatus',
    SystemLogs: 'SystemLogs',
    FetchFingerPrintAction: 'FetchFingerPrintAction',
    LoginStatusResponse: 'LOGIN_STATUS',
    LOGOUT_USER: 'LOGOUT_USER',
    FETCH_CANVAS: "FETCH_CANVAS",
    fetchClientPositionMetadata: "FETCH_CLIENT_POSITION_META_DATA",
    clientPositionMetaData: "CLIENT_POSITION_META_DATA",
    FETCH_ACCOUNT_PANEL_META_DATA:"FETCH_CLIENT_META_DATA",
    ACCOUNT_PANEL_META_DATA:"CLIENT_META_DATA",
    FETCH_BROKER_PANEL_META_DATA:"FETCH_BROKER_META_DATA",
    BROKER_PANEL_META_DATA:"BROKER_META_DATA",
    FETCH_SUBBROKER_PANEL_META_DATA:"FETCH_SUBBROKER_META_DATA",
    FETCH_LOGIN_DEVICE_LOG:"FETCH_LOGIN_DEVICE_LOG",
    SUBBROKER_PANEL_META_DATA:"SUBBROKER_META_DATA",
    FETCH_DEALING_PANEL_META_DATA:"FETCH_DEALING_META_DATA",
    DEALING_PANEL_META_DATA:"DEALING_META_DATA",
    FETCH_ORDER_PANEL_META_DATA:"FETCH_ORDER_META_DATA",
    ORDER_PANEL_META_DATA:"ORDER_META_DATA",
    FETCH_ADD_WIDGET_META_DATA: "FETCH_ADD_WIDGET_META_DATA",
    FETCH_CLIENT_POSITIONS_PRENETQTY: "FETCH_CLIENT_POSITIONS_PRENETQTY",
    OPEN_CUSTOM_ADD_WIDGET_DIALOG: "OPEN_CUSTOM_ADD_WIDGET_DIALOG",
    OPEN_ADD_WIDGET_DIALOG: "OPEN_ADD_WIDGET_DIALOG",
    CLEAR_MESSAGE:'CLEAR_MESSAGE',
    OPEN_TDH_MODAL:"OPEN_TDH_MODAL",
    EXECUTE_TDH:"TDH_EXECUTION",
    TDH_RESPONSE_MESSAGE:"TDH_RESPONSE_MESSAGE",
    FETCH_LOGIN_AND_SYMBOL:"FETCH_ALL_LOGIN_AND_SYMBOL",
    LOGIN_AND_SYMBOL:"CLIENT_AND_SYMBOL",
    OPEN_SYMBOL_MARGIN_MODAL:'OPEN_SYMBOL_MARGIN_MODAL',
    OPEN_HIGH_LOW_MISMATCH_MODAL:'OPEN_HIGH_LOW_MISMATCH_MODAL',
    FETCH_HIGH_LOW_MISMATCH_DATA:"FETCH_HIGH_LOW_MISMATCH_DATA",
    HIGH_LOW_MISMATCH_DATA:"HIGH_LOW_MISMATCH_DATA",
    TOGGLE_CUSTOMIZE_WIDGET_MODAL:"TOGGLE_CUSTOMIZE_WIDGET_MODAL",
    TOGGLE_ADD_PAGE_MODAL:"TOGGLE_ADD_PAGE_MODAL",
    SET_ACTIVE_TAB_SET:"SET_ACTIVE_TAB_SET",
    SET_CANVAS_MODEL:"SET_CANVAS_MODEL",
    RESET_CANVAS_STATE: "RESET_CANVAS_STATE",
    ADD_TO_FILTER:"ADD_TO_FILTER",
    REMOVE_FILTER:"REMOVE_FILTER",
    UPDATE_CELL_VALUE:"UPDATE_DATA_BY_TABLENAME",
    FETCH_PAGE_LIST:"FETCH_PAGE_LIST",
    PAGE_LIST:"PAGE_LIST",
    ADD_NEW_PAGE: "ADD_NEW_PAGE",
    SAVE_PAGE:"SAVE_PAGE",
    UPDATE_PAGE:"UPDATE_PAGE",
    SET_ACTIVE_PAGE: "SET_ACTIVE_PAGE",
    FETCH_PAGE_DETAILS: "FETCH_PAGE_DETAILS",
    PAGE_DETAILS: "PAGE_DETAILS",
    DELETE_PAGE:"DELETE_PAGE",
    ACTIVATE_ORDER:"ORDER_ACTIVATE_REQUEST",
    UPDATE_PAGE_RES:"UPDATE_PAGE_RES",
    SET_ALERT_MESSAGE:"SET_ALERT_MESSAGE",
    SET_CANVAS_FILTERS:"SET_CANVAS_FILTERS",
    SET_CANVAS_FILTER_COLOR:"SET_CANVAS_FILTER_COLOR",
    COLOR_ENABLE : "COLOR_ENABLE",
    OPEN_COLOR_TEMPLATE_MODAL : "OPEN_COLOR_TEMPLATE_MODAL",
    SAVE_COLOR_TEMPLATE : "SAVE_COLOR_TEMPLATE",
    FETCH_COLOR_TEMPLATES : "FETCH_COLOR_TEMPLATES",
    COLOR_TEMPLATES : "COLOR_TEMPLATES",
    SET_SELECTED_THEME : "SET_SELECTED_THEME",
    DELETE_TEMPLATE : "DELETE_TEMPLATE",
    FETCH_SELECTED_THEME:"FETCH_SELECTED_THEME",
    SELECTED_THEME:"SELECTED_THEME",
    SET_IS_PAGE_UNSAVED:"SET_IS_PAGE_UNSAVED",
    REORDER_PAGE:"REORDER_PAGE",
    UPDATE_PAGE_SEQUENCE:"UPDATE_PAGE_SEQUENCE",
    SAVE_USER_DETAILS: "SAVE_USER_DETAILS",
    FETCH_USERS: "FETCH_USERS_DATA",
    FETCH_USER_DETAILS: "FETCH_USER_DETAILS",
    USERS_DATA: "USERS_DATA",
    USER_DETAILS: "USER_DETAILS",
    DELETE_USER_DETAILS: "DELETE_USER_DETAILS",
    SAVE_COLOR_THEME : "SAVE_COLOR_THEME",
    FETCH_COLOR_THEMES : "FETCH_COLOR_THEMES",
    DELETE_COLOR_THEME : "DELETE_COLOR_THEME",
    COLOR_THEMES : "COLOR_THEMES",
    FETCH_ALL_GROUP_DATA: "FETCH_ALL_GROUP_DATA",
    ALL_GROUP_DATA: "ALL_GROUP_DATA",
    GET_SYMBOLMAPPING : "GET_SYMBOLMAPPING",
    SYMBOLMAPPING_DATA : "SYMBOLMAPPING_DATA",
    SYMBOL_FILE_TRANSFER : "SYMBOL_FILE_TRANSFER",
    CLOSING_UPDATE_UPLOAD : "CLOSING_UPDATE_UPLOAD",
    IGNORE_CLOSINGANDSAVE : "IGNORE_CLOSINGANDSAVE",
    CLOSINGPRICE_LIST : "CLOSINGPRICE_LIST",
    TOGGLE_LOGIN_SETTINGS_MODAL: "TOGGLE_LOGIN_SETTINGS_MODAL",
    FETCH_REJECT_LIMIT_SETTING:"FETCH_REJECTLIMIT_SETTING",
    REJECT_LIMIT_SETTING:"REJECTLIMIT_SETTING",
    UPDATE_REJECTLIMIT_SETTING:"UPDATE_REJECTLIMIT_SETTING",
    UPDATE_CLIENT_CREDIT:"UPDATE_CLIENTCREDIT",
    UPDATE_SYMBOL_MARGIN:"UPDATE_SYMBOLMARGIN",
    FETCH_ALL_SYMBOl_GROUP:"FETCH_ALL_SYMBOLGROUPINFO",
    SYMBOL_GROUP_INFO: "SYMBOLGROUPINFO",
    BALANCE_TRANSFER_REQUEST:"BALANCE_TRANSFER_REQUEST",
    BALANCE_TRANSFER_STATUS: "BALANCE_TRANSFER_STATUS",
    VERIFY_POSITION:"VERIFY_POSITION",
    DEAL_TRANSFER_REQUEST: "DEAL_TRANSFER_REQUEST",
    POSITION_TRANSFER_STATUS:"POSITIONTRANSFER_STATUS",
    TRADE_DATE_CHANGE: "TRADE_DATE_CHANGE",
    OREKA_RESET:"OREKA_RESET",
    POSITION_MATCH_REPORT: "POSITION_MATCH_REPORT",
    DELETE_DATA_REQUEST: "DELETE_DATA_REQUEST",
    DELETE_DATA_STATUS: "DELETE_DATA_STATUS",
    TICKDATA:"TICK_DATA"
}

export const ReducerActionConstants = {
  CanvasMetaDataAction: "CanvasMetaDataAction",
  FetchColumnTemplate: "FETCH_COLUMN_TEMPLATE",
  AddWidgetInCanvasAction: "AddWidgetInCanvasAction",
  UpdateCanvasModel: "UpdateCanvasModel",
};
