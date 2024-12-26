import React, { useState, lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

// Lazy load components
const CoomingSoon = lazy(() => import("./Components/CoomingSoon"));
const Loader = lazy(() => import("./Components/Loader/Loader"));
axios.defaults.baseURL = "https://www.spotsball.com/spotsball/api/";

const App = () => {
  const [loader, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    // Start loading when a new route is loading
    window.addEventListener("beforeunload", handleStart);
    window.addEventListener("load", handleStop);

    return () => {
      window.removeEventListener("beforeunload", handleStart);
      window.removeEventListener("load", handleStop);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>{loader ? "loader....." : "SpotsBall"}</title>
      </Helmet>
      <Router basename="/">
        {" "}
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<CoomingSoon />} />
            {/* <Route path="*" element={<PageNot />} /> */}
          </Routes>
        </Suspense>
      </Router>
    </>
  );
};

export default App;
