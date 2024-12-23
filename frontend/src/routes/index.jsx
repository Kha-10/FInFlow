import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import AddToPurchases from "@/pages/AddToPurchases";
import Layout from "../pages/layouts/Layout";
import React from "react";

function index() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "/purchases",
          element: <AddToPurchases />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default index;