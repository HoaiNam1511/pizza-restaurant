import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routers from "./router";
import MainLayout from "./layout/MainLayout/MainLayout";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    {routers.map((route, index) => {
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
                    })}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
