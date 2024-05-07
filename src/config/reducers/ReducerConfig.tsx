import AppReducer from "../../redux/reducers/app/AppReducer";

import { createStore, combineReducers } from "redux";
import CanvasReducer from "../../redux/reducers/canvas/CanvasReducer";
import PageReducer from "../../redux/reducers/page/PageReducer";
import UsersReducer from "../../redux/reducers/users/UsersReducers";
import SaturdayDeleteReducer from "../../redux/reducers/app/SaturdayDeleteReducer";
import SettingReducer from "../../redux/reducers/app/SettingReducer";

export function createReducerManager(initialReducers: any): any {
  // Create an object which maps keys to reducers
  const reducers = { ...initialReducers };

  // Create the initial combinedReducer
  let combinedReducer = combineReducers(reducers);

  // An array which is used to delete state keys when reducers are removed
  let keysToRemove: any[] = [];

  return {
    getReducerMap: () => reducers,

    // The root reducer function exposed by this object
    // This will be passed to the store
    reduce: (state: any, action: never) => {
      // If any reducers have been removed, clean up their state first
      if (keysToRemove.length > 0) {
        state = { ...state };
        for (let key of keysToRemove) {
          delete state[key];
        }
        keysToRemove = [];
      }

      // Delegate to the combined reducer
      return combinedReducer(state, action);
    },

    // Adds a new reducer with the specified key
    add: (key: string, reducer: any) => {
      if (!key || reducers[key]) {
        return;
      }

      // Add the reducer to the reducer mapping
      reducers[key] = reducer;

      // Generate a new combined reducer
      combinedReducer = combineReducers(reducers);
    },

    // Removes a reducer with the specified key
    remove: (key: string) => {
      if (!key || !reducers[key]) {
        return;
      }

      // Remove it from the reducer mapping
      delete reducers[key];

      // Add the key to the list of keys to clean up
      keysToRemove.push(key);

      // Generate a new combined reducer
      combinedReducer = combineReducers(reducers);
    },
  };
}

const staticReducers = (history: any) => {
  return {
    // router: createRouterReducer(history),
    app: AppReducer,
    canvas: CanvasReducer,
    page: PageReducer,
    users: UsersReducer,
    saturdayDelete: SaturdayDeleteReducer,
    setting : SettingReducer
  };
};

export function configureStore(initialState: any, history: any): any {
  const reducerManager = createReducerManager(staticReducers(history));

  // Create a store with the root reducer function being the one exposed by the manager.
  const store: any = createStore(reducerManager.reduce, initialState);

  // Optional: Put the reducer manager on the store so it is easily accessible
  store.reducerManager = reducerManager;

  return store;
}
