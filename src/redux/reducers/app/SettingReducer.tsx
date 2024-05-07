import { AnyAction } from "redux";
import { ReducerConstants } from "../../../config/reducers/ReducerConstants";
import initialState from '../../../config/reducers/ReducerInitialState';

export default function SettingReducer(state = initialState.setting, action: AnyAction) {
    switch(action.type) {
        case ReducerConstants.SYMBOLMAPPING_DATA:{
            return {
                ...state,
                mappingData:action.symboldata
            }
        }
        case ReducerConstants.CLOSINGPRICE_LIST:{
            return {...state,closingUpdate:{...state.closingUpdate,data:action.data}};
        }
        case ReducerConstants.CLOSING_UPDATE_UPLOAD: {
            return  {
                ...state
            }
        }
        case ReducerConstants.REJECT_LIMIT_SETTING:{
            return {
                ...state,
                loginSettingsModalState: {
                    ...state.loginSettingsModalState,
                    rejectLimitSettings:action.limits
                }
            }
        }
        case ReducerConstants.TOGGLE_LOGIN_SETTINGS_MODAL:{
            return {
                ...state,
                loginSettingsModalState:{
                    ...state.loginSettingsModalState,
                    open:action.open,
                    loginValue:action.loginValue
                }
            }
        }
        case ReducerConstants.SYMBOL_GROUP_INFO:{
            return {
                ...state,
                loginSettingsModalState:{
                    ...state.loginSettingsModalState,
                    symbolGroups:action.symbolgroups.map((symbolGroup:any) => (symbolGroup.symbolgroup))
                }
            }
        }
        default:
            return state;
    }
}
