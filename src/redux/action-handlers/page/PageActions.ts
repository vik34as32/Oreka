import { ReducerConstants } from "../../../config/reducers/ReducerConstants";
import { PageMetaInfoType } from "../../../ui/canvas/services/CanvasService";
import { sendMessage } from "../../../redux/action-handlers/app/AppActions";
// import { Oreka as UpdatePageSequence } from "../../../proto/UpdatePageSequence";
import { Oreka as ClientMessage } from "../../../proto/clientmessage";

export function setActivePage(pageId:string) {
    return {
        type:ReducerConstants.SET_ACTIVE_PAGE,
        pageId
    }
}
export function addNewPage(pageId:string,name:string,shortName:string) {
    return {
        type: ReducerConstants.ADD_NEW_PAGE,
        pageId,
        name,
        shortName
    }
}
export function deletePage(pageId:string) {
    return {
        type:ReducerConstants.DELETE_PAGE,
        pageId
    }
}
export function updatePage(pageDetails:PageMetaInfoType) {
    return {
        type:ReducerConstants.UPDATE_PAGE,
        pageDetails
    }
}
export function setIsPageUnsaved(value:boolean){
    return {
        type:ReducerConstants.SET_IS_PAGE_UNSAVED,
        value
    }
}

export function reOrderPage(pages:PageMetaInfoType[]){
    return({
        type : ReducerConstants.REORDER_PAGE,
        pages
    })
}

export function reOrderPageServer(page:any){
    const userId = localStorage.getItem('loginUser');
    const request = UpdatePageSequence.UpdatePageSequence.fromObject({type: ReducerConstants.UPDATE_PAGE_SEQUENCE, data: page});
    const clientMessage= new ClientMessage.ClientMessage();
    clientMessage.updatepagesequence = request;
    const buf = clientMessage.serializeBinary();
    sendMessage(buf);
}
