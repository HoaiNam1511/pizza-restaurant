import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GlobalStyle from "./components/GlobalStyle/GlobalStyle";
import "bootstrap/dist/css/bootstrap.min.css";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Toast from "./components/Toast/Toast";
import { PersistGate } from "redux-persist/integration/react";
const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <GlobalStyle>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Toast />
                    <App />
                </PersistGate>
            </Provider>
        </GlobalStyle>
        <ToastContainer pauseOnFocusLoss={false} limit={3} autoClose={4000} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
