import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./components/Toast/ToastContainer";
import App from "./App";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import CreateMemory from "./pages/CreateMemory/CreateMemory";
import MemoryDetail from "./pages/MemoryDetail/MemoryDetail";
import NotFound from "./pages/NotFound/NotFound";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import MemoriesPublics from "./pages/MemoriesPublics/MemoriesPublics"
import "./styles/global.scss";

const routes = [
  {
    path: "/",
    // Envolva o App com AuthProvider e ToastProvider AQUI
    element: (
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/create",
        element: (
          <ProtectedRoute>
            <CreateMemory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/public",
        element: (
          <ProtectedRoute>
            <MemoriesPublics/>
          </ProtectedRoute>
        )
      },
      {
        path: "/memories/:id",
        element: (
          <ProtectedRoute>
            <MemoryDetail />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);