import { Dayjs } from "dayjs";
import { ReducerConstants } from "../../../config/reducers/ReducerConstants";
import { getBufferDataForFetchLoginUserWiseDataRequest, sendMessage } from "./AppActions";
import { Oreka as ClientMessage } from "../../../proto/clientmessage";
import { Oreka as BalanceTransferRequest} from "../../../proto/BalanceTransferRequest";
import { Oreka as DealTransferRequest} from "../../../proto/DealTransferRequest";
import { Oreka as TradeDateChange} from "../../../proto/TradeDateChange";
import { Oreka as DeleteDataRequest} from "../../../proto/DeleteDataRequest";
import { Oreka as TypeAndFileName } from "../../../proto/TypeAndFileName";

export function fetchAllGroupData() {
  const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.FETCH_ALL_GROUP_DATA);
  sendMessage(buf);
}
export function balanceTransferRequest(groups:string[]) {
  const request = BalanceTransferRequest.BalanceTransferRequest.fromObject({
    type: ReducerConstants.BALANCE_TRANSFER_REQUEST,
    groups: groups,
  });
  const clientMessage= new ClientMessage.ClientMessage();
  clientMessage.balancetransferrequest = request;
  const buf = clientMessage.serializeBinary();
  sendMessage(buf);
}
export function resetBalanceTransferStatus() {
  return {
    type:ReducerConstants.BALANCE_TRANSFER_STATUS,
    TRANSFERED:0,
    PENDING:100
  }
}
export function verifyPosition(fileName:string) {
  const request = TypeAndFileName.TypeAndFileName.fromObject({
    type: ReducerConstants.VERIFY_POSITION,
    filename: fileName
  });
  const clientMessage = new ClientMessage.ClientMessage();
  clientMessage.typeandfilename = request;
  const buf = clientMessage.serializeBinary();
  sendMessage(buf);
}
export function dealTransferViaSql(groups:string[]) {
  const request = DealTransferRequest.DealTransferRequest.fromObject({
    type: ReducerConstants.DEAL_TRANSFER_REQUEST,
    groups: groups,
  });
  const clientMessage= new ClientMessage.ClientMessage();
  clientMessage.dealtransferrequest = request;
  const buf = clientMessage.serializeBinary();
  sendMessage(buf)
}
export function dealTransferViaFile(groups:string[],fileName:string) {
  const request = DealTransferRequest.DealTransferRequest.fromObject({
    type: ReducerConstants.DEAL_TRANSFER_REQUEST,
    groups: groups,
    filename: fileName
  });
  const clientMessage= new ClientMessage.ClientMessage();
  clientMessage.dealtransferrequest = request;
  const buf = clientMessage.serializeBinary();
  sendMessage(buf)
}
export function resetPositionTransferStatus() {
  return {
    type:ReducerConstants.POSITION_TRANSFER_STATUS,
    TRANSFERED:0,
    PENDING:100
  }
}
export function tradeDateChange(from:Dayjs, to:Dayjs, changedDate:Dayjs) {
  const request = TradeDateChange.TradeDateChange.fromObject({
    type: ReducerConstants.TRADE_DATE_CHANGE,
    FROM:from.unix(),
    TO:to.unix(),
    CHANGED_DATE:changedDate.unix()
  });
  const clientMessage= new ClientMessage.ClientMessage();
  clientMessage.tradedatechange = request;
  const buf = clientMessage.serializeBinary();
  sendMessage(buf);
}
export function resetTradeDeleteMessages() {
  return {
    type:ReducerConstants.POSITION_MATCH_REPORT,
    message:[],
    status:"match"
  }
}
export function deleteDataRequest(groups:string[]) {
  const request = DeleteDataRequest.DeleteDataRequest.fromObject({
    type: ReducerConstants.DELETE_DATA_REQUEST,
    groups: groups,
  });
  const clientMessage= new ClientMessage.ClientMessage();
  clientMessage.deletedatarequest = request;
  const buf = clientMessage.serializeBinary();
  sendMessage(buf);
}