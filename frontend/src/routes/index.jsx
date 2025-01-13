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
import InitialLoading from "@/components/InitialLoading";

const ProtectedRoute = ({ loading, user, children }) => {
  // While loading, show loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // After loading, check authentication
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the protected content
  return children;
};

function index() {
  let { user, loading } = useContext(AuthContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/dashboard",
          //   element: user ? <Home />  : <Navigate to={"/login"} />,
          element: loading ? (
            <InitialLoading />
          ) : user ? (
            <Home />
          ) : (
            <Navigate to={"/login"} />
          ),
          // element:  <Home /> ,
        },
        {
          path: "/purchases",
          //   element: user ? <AddToPurchases /> : <Navigate to={"/login"} />,
          // element:  <AddToPurchases /> ,
          element: loading ? (
            <InitialLoading />
          ) : user ? (
            <AddToPurchases />
          ) : (
            <Navigate to={"/login"} />
          ),
        },
        {
          path: "/login",
          //   element: !user ? <LogIn /> : <Navigate to={"/dashboard"} />,
          //   element: <LogIn />,
          element: loading ? (
            <InitialLoading />
          ) : !user ? (
            <LogIn />
          ) : (
            <Navigate to={"/dashboard"} />
          ),
        },
        {
          path: "/register",
          //   element: !user ? <Register /> : <Navigate to={"/dashboard"} />,
          //   element: <Register />,
          element: loading ? (
            <InitialLoading />
          ) : !user ? (
            <Register />
          ) : (
            <Navigate to={"/dashboard"} />
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default index;