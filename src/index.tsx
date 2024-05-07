// src/main.js
import React from "react";
import { createRoot } from "react-dom/client";
import { configureStore } from "./config/reducers/ReducerConfig";
import initialState from "./config/reducers/ReducerInitialState";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "./config/theme/Theme";
// import "./assets/css/dark.css";
// import "./assets/css/aggrid_custom.css";
// import "./assets/css/theme.css";
// import "./assets/css/flexlayout_custom.css";
import LoginPage from "./ui/login/loginPage";
import App from "./App";
import UserManagement from "./ui/components/page/UserManagement";
import AddonConfigure from "./ui/components/page/addon/AddonConfigure";

export const history = createBrowserHistory();

const rootNode = document.getElementById("app");
export const store = configureStore(initialState, history);
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/app",
    element: <App />,
  },
 {
   path:"/addon-configure",
   element:<AddonConfigure/>
 },
 {
   path: "*",
   element: <Navigate to={"/app"} replace />,
 },
  {
    path: "/usermanagement",
    element: <UserManagement />,
  },
]);
if (rootNode) {
  createRoot(rootNode).render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}
