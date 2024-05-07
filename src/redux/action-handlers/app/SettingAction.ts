// import { ReducerConstants } from "../../../config/reducers/ReducerConstants";
// import { getBufferDataForFetchLoginUserWiseDataRequest, sendMessage } from "./AppActions";
// import { Oreka as ClientMessage } from "../../../proto/clientmessage";
// import { Oreka as FetchLoginuserWiseDataRequest } from "../../../proto/FetchLoginUserWiseDataRequest";
// import { Oreka as UpdateClientCredit } from "../../../proto/UpdateClientcredit";
// import { Oreka as UpdateSymbolMargin } from "../../../proto/UpdateSymbolmargin";
// import { Oreka as ClosingUpdateUpload } from "../../../proto/ClosingUpdateUpload";
// import { Oreka as IgnoreClosingAndSave } from "../../../proto/IgnoreClosingandsave";
// import { Oreka as updateRejectLimitSetting } from "../../../proto/UpdateRejectlimitSetting";
// import { Oreka as TypeAndFileName } from "../../../proto/TypeAndFileName";


// export function fetchSymbolMappingData() {
//     const loginUser = localStorage.getItem('loginUser');
//     if (loginUser) {
//         const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.GET_SYMBOLMAPPING);
//         sendMessage(buf);
//     }
// }
// export function startFileProcessing(filename: string) {
//     const loginUser = localStorage.getItem('loginUser');
//     if (loginUser) {
//         const request = TypeAndFileName.TypeAndFileName.fromObject({
//             type: ReducerConstants.SYMBOL_FILE_TRANSFER,
//             filename: filename
//         });
//         const clientMessage = new ClientMessage.ClientMessage();
//         clientMessage.typeandfilename = request;
//         const buf = clientMessage.serializeBinary();
//         sendMessage(buf);
//     }
// }

// export function sendClosingDateAndName(closingdate: string, filename: string) {
//     const loginUser = localStorage.getItem('loginUser');
//     if (loginUser) {
//         const request = ClosingUpdateUpload.ClosingUpdateUpload.fromObject({key: ReducerConstants.CLOSING_UPDATE_UPLOAD, closingdate: closingdate, filename: filename });
//         const clientMessage= new ClientMessage.ClientMessage();
//         clientMessage.closingupdateupload = request;
//         const buf = clientMessage.serializeBinary();
//         sendMessage(buf)
//     }
// }
// export function sendClosingUpdateData(data) {
//     const loginUser = localStorage.getItem('loginUser');
//     if (loginUser) {
//         const request = IgnoreClosingAndSave.IgnoreClosingandsave.fromObject({type: ReducerConstants.IGNORE_CLOSINGANDSAVE, data: data});
//         const clientMessage= new ClientMessage.ClientMessage();
//         clientMessage.ignoreclosingandsave = request;
//         const buf = clientMessage.serializeBinary();
//         sendMessage(buf);
//     }
// }
// export function fetchRejectLimitSettings(loginValue:string) {
//     const request = FetchLoginuserWiseDataRequest.FetchLoginUserWiseDataRequest.fromObject({type: ReducerConstants.FETCH_REJECT_LIMIT_SETTING, loginUser: loginValue});
//     const clientMessage= new ClientMessage.ClientMessage();
//     clientMessage.typeandloginrequest = request;
//     const buf = clientMessage.serializeBinary();
//     sendMessage(buf);
// }
// export function updateRejectLimitSettings(clientLimits:any[]) {
//     const request = updateRejectLimitSetting.UpdateRejectlimitSetting.fromObject({type: ReducerConstants.UPDATE_REJECTLIMIT_SETTING, clientlimits: clientLimits});
//     const clientMessage= new ClientMessage.ClientMessage();
//     clientMessage.updaterejectlimitsetting = request;
//     const buf = clientMessage.serializeBinary(); 
//     sendMessage(buf);
// }
// export function updateClientCredit(login:string,credit:number) {
//     const request = UpdateClientCredit.UpdateClientcredit.fromObject({ type:ReducerConstants.UPDATE_CLIENT_CREDIT, clientcredits:[{login,credit}]});
//     const clientMessage= new ClientMessage.ClientMessage();
//     clientMessage.updateclientcredit = request;
//     const buf = clientMessage.serializeBinary();
//     sendMessage(buf);
// }
// export function updateSymbolMargin(symbol: string, margin: string) {
//     const request = UpdateSymbolMargin.UpdateSymbolmargin.fromObject({
//         type: ReducerConstants.UPDATE_SYMBOL_MARGIN,
//         symbolgroupmargins: [{symbolgroup: symbol, symbolgroupmargin: parseFloat(margin)}]
//     });
//     const clientMessage = new ClientMessage.ClientMessage();
//     clientMessage.updatesymbolmargin = request;
//     const buf = clientMessage.serializeBinary();
//     sendMessage(buf);
// }
// export function toggleLoginSettingsModal(open:boolean,loginValue:string) {
//     return {
//         type:ReducerConstants.TOGGLE_LOGIN_SETTINGS_MODAL,
//         open,
//         loginValue
//     }
// }
// export function fetchAllSymbolGroup() {
//     const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.FETCH_ALL_SYMBOl_GROUP);
//     sendMessage(buf);
// }