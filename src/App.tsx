import React, { Suspense } from "react";
import "./App.css";
import Loading from "./components/loading";
import NavBar from "./components/navBar";
import { routeStore } from "./lib/stores";
import { RouteDirection } from "./lib/types";

function App() {
  const { route } = routeStore();
  const LoadedComponent = React.lazy(() => {
    if (route === RouteDirection.HOME_PAGE) {
      return import("./components/homePage")
    } else if (route === RouteDirection.LOGIN_PAGE) {
      return import("./components/loginPage")
    } else if (route === RouteDirection.REGISTER_PAGE) {
      return import("./components/registerPage")
    } else if (route === RouteDirection.POST_PAGE) {
      return import("./components/postPage")
    } else {
      return import("./components/notFoundPage")
    }
  })
  return (
    <>
      <div>
        <NavBar />
      </div>
      <div>
        <Suspense fallback={<Loading />}>
        <LoadedComponent />
        </Suspense>
      </div>
    </>
  );
}

export default App;
