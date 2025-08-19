import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthInitializer } from "./AuthInitializer";
import ProtectedRoute from "./advancedRoutes/ProtectedRoute";
import GuestRoute from "./advancedRoutes/GuestRoute";
import Loading from "./components/ui/Loading";

import RootLayout from "./layouts/RootLayout";
const FavoritePage = lazy(() => import("./pages/FavoritePage"));

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/favorite",
        element: <ProtectedRoute />,
        children: [{ index: true, element: <FavoritePage /> }],
      },
    ],
  },
  {
    path: "/auth",
    element: <GuestRoute />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      {
        path: "login",
        element: (
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<Loading />}>
            <Register />
          </Suspense>
        ),
      },
    ],
  },
]);

const Routers = () => {
  return (
    <>
      <AuthInitializer />
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
};

export default Routers;
