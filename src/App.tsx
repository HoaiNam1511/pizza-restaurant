import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routers from "./router";
import MainLayout from "./layout/MainLayout/MainLayout";
import Login from "./pages/Login/Login";
import ResetPassword from "./pages/Login/ResetPassword";
import { useSelector } from "react-redux";
import * as selectState from "./redux/selector";
import config from "./config";
import { toast } from "react-toastify";
function App() {
    const currentAccount = useSelector(selectState.selectCurrentAccount);
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route
                        path={config.routes.reset}
                        element={<ResetPassword></ResetPassword>}
                    ></Route>
                    <Route
                        path={config.routes.login}
                        element={<Login></Login>}
                    ></Route>
                    <Route path={"/"} element={<Login></Login>}></Route>
                    {currentAccount?.account ? (
                        routers?.map((route, index) => {
                            let Layout = MainLayout;
                            if (route.layout === null) {
                                Layout = MainLayout;
                            } else if (route.layout) {
                                Layout = route.layout;
                            }
                            let Page = route.page;
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page></Page>
                                        </Layout>
                                    }
                                ></Route>
                            );
                        })
                    ) : (
                        <Route
                            path={config.routes.login}
                            element={<Login></Login>}
                        ></Route>
                    )}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
