// import { ReducerConstants } from "../../../config/reducers/ReducerConstants";
// import { UserDataType } from "../../../ui/components/page/UserManagementProfile";
// import { getBufferDataForFetchLoginUserWiseDataRequest, sendMessage } from "../app/AppActions";
// import { Oreka as ClientMessage } from "../../../proto/clientmessage";
// import { Oreka as UserDetails } from "../../../proto/UserDetails";

// export function fetchUsers() {
//     const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.FETCH_USERS);
//     sendMessage(buf);
// }

// export function fetchUsersProfile(login: string){
//     const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.FETCH_USER_DETAILS, login);
//     sendMessage(buf)
// }

// export function deleteUsersProfile(login: string){
//     const buf = getBufferDataForFetchLoginUserWiseDataRequest(ReducerConstants.DELETE_USER_DETAILS, login);
//     sendMessage(buf);
// }

// export function saveUsersProfile(user: UserDataType){
//     const request = UserDetails.UserDetails.fromObject({type: ReducerConstants.SAVE_USER_DETAILS, data: user});
//     const clientMessage= new ClientMessage.ClientMessage();
//     clientMessage.userdetails = request;
//     const buf = clientMessage.serializeBinary();
//     sendMessage(buf)
// }

