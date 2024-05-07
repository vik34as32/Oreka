import { AnyAction } from "redux";
import { ReducerConstants } from "../../../config/reducers/ReducerConstants";
import initialState from '../../../config/reducers/ReducerInitialState';

export default function SaturdayDeleteReducer(state = initialState.saturdayDelete, action: AnyAction) {
    switch(action.type) {
        case ReducerConstants.ALL_GROUP_DATA:{
            return {
                ...state,
                groupData:action.groups
            }
        }
        case ReducerConstants.BALANCE_TRANSFER_STATUS:{
            return {
                ...state,
                balanceTransferStatus:{
                    transfered:action.TRANSFERED,
                    pending:action.PENDING
                }
            }
        }
        case ReducerConstants.POSITION_TRANSFER_STATUS:{
            return {
                ...state,
                positionTransferStatus:{
                    transfered:action.TRANSFERED,
                    pending:action.PENDING
                }
            }
        }
        case ReducerConstants.POSITION_MATCH_REPORT: {
            return {
                ...state,
                tradeDelete:{
                    ...state.tradeDelete,
                    messages:action.message.map((message:string) => ({message})),
                    status:action.status
                }
            }
        }
        case ReducerConstants.DELETE_DATA_STATUS: {
            return {
                ...state,
                tradeDelete:{
                    ...state.tradeDelete,
                    deleteDataStatus:{
                        deleted:action.DELETED_DATA,
                        pending:action.PENDING_DATA
                    }
                }
            }
        }
        default:
            return state;
    }
}
