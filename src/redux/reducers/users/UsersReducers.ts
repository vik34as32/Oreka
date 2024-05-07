import { AnyAction } from "redux";
import InitialState from "../../../config/reducers/ReducerInitialState";
import { ReducerConstants } from "../../../config/reducers/ReducerConstants";

export default function UsersReducer(
  state = InitialState.users,
  action: AnyAction
) {
  switch (action.type) {
    case ReducerConstants.USERS_DATA: {
      if (action.action === "delete") {
        return {
          ...state,
          users: state.users.filter(
            (s: any) => s.sessionid !== action.sessionid
          ),
        };
      } else if (action.action === "add") {
        return {
          ...state,
          users: [
            ...state.users,
            {
              loginuser: action.users[0].loginuser,
              name: action.users[0].name,
              status: "",
            },
          ],
        };
      } else if (action.users) {
        return {
          ...state,
          users: action.users,
        };
      }
    }
    case ReducerConstants.USER_DETAILS: {
      return {
        ...state,
        user: action.data,
      };
    }
    default:
      return state;
  }
}
