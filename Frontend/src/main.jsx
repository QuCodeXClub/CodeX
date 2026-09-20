import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";

import "./index.css";
import App from "./App";
import SplashScreen from "./components/common/SplashScreen";
import router from "./routes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App>
        <RouterProvider
          router={router}
          future={{ v7_startTransition: true }}
          fallbackElement={<SplashScreen />}
        />
      </App>
    </Provider>
  </React.StrictMode>
);