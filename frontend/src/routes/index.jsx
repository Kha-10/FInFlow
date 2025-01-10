import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Home from "../pages/Home";
import AddToPurchases from "@/pages/AddToPurchases";
import Layout from "../pages/layouts/Layout";
import LogIn from "@/pages/LogIn";
import Register from "@/pages/Register";
import React from "react";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

function index() {
  let { user } = useContext(AuthContext);
    console.log('user',user);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/dashboard",
          element: user ? <Home /> : <Navigate to={"/login"} />,
            // element:  <Home /> ,
        },
        {
          path: "/purchases",
          element: user ? <AddToPurchases /> : <Navigate to={"/login"} />,
            // element:  <AddToPurchases /> ,
        },
        {
          path: "/login",
            element: !user ? <LogIn /> : <Navigate to={"/dashboard"} />,
        //   element: <LogIn />,
        },
        {
          path: "/register",
            element: !user ? <Register /> : <Navigate to={"/dashboard"} />,
        //   element: <Register />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default index;
