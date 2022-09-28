import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { socket, SocketProvider } from "./socketConfig";
import "./index.css";
import App from "./App";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <SocketProvider value={socket}>
        <Provider store={store}>
          <App />
        </Provider>
      </SocketProvider>
    </BrowserRouter>
  </HelmetProvider>
);
