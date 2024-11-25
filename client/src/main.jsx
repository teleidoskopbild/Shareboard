import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CreateBoard from "./pages/CreateBoard.jsx";
import Login from "./pages/Login.jsx";
import Settings from "./pages/Settings.jsx";
import Board from "./pages/Board.jsx";
import SelectBoard from "./pages/SelectBoard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "createboard", element: <CreateBoard /> },
      { path: "selectboard", element: <SelectBoard /> },
      { path: "settings/:shareboardId?", element: <Settings /> },
      { path: "board/:shareboardId?", element: <Board /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
