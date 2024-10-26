import React, { useState, useEffect } from "react";

import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import FollowTwitter from "./components/followTwitter/FollowTwitter";
import UpdateDetails from "./components/updateDetails/UpdateDetails";
import WelcomeUser from "./components/welomeUser/WelcomeUser";
import Dashboard from "./components/dashboard/Dashboard";
import SplashScreen from "./components/splashScreen/SplashScreen";
import Chooser from "./components/migration/Chooser";


const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashScreen />,
  },
  {
    path: "follow-twitter",
    element: <FollowTwitter />,
  },
  {
    path: "update-details",
    element: <UpdateDetails />,
  },
  {
    path: "welcome",
    element: <WelcomeUser />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "choose-action",
    element: <Chooser />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;