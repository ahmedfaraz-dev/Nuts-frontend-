import { createBrowserRouter, Outlet } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Layout from "./Components/Layout/Layout";
import Home from "./Pages/Home";
import ProductDetails from "./Pages/ProductDetails";
import MinimalLayout from "./Components/Layout/MiniLaout";
import Customerdetails from "./Pages/Customerdetails";

// second block imports (kept as-is assumed)
import Cart from "./Pages/Cart";
import ProductList from "./Pages/ProductList";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import Profile from "./Pages/Profile";
import OrderHistory from "./Pages/OrderHistory";
import TestCurrency from "./Pages/TestCurrency";

import AdminLayout from "./Components/Admin/AdminLayout";
import Dashboard from "./Pages/admin/Dashboard";
import Products from "./Pages/admin/Products";
import Categories from "./Pages/admin/Categories";
import Deals from "./Pages/admin/Deals";
import Orders from "./Pages/admin/Orders";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import OAuthCallback from "./Pages/OAuthCallback";
import OAuthFailed from "./Pages/OAuthFailed";

import CustomerDetails from "./Pages/CustomerDetails";
import PaymentForm from "./Pages/PaymentForm";
import Paysucessmodel from "./Pages/Paysucessmodel";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


export const route = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "search",
        element: <ProductList />,
      },
      {
        path: "all-products",
        element: <ProductList />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "order-history",
        element: (
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "test-currency",
        element: <TestCurrency />,
      },
    ],
  },
  {
    path: "/admin-dashboard",
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "deals",
        element: <Deals />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
    ],
  },
  {
    path: "/",
    element: <MinimalLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "auth/google/callback",
        element: <OAuthCallback />,
      },
      {
        path: "auth/google/failed",
        element: <OAuthFailed />,
      },
      {
        element: (
          <Elements stripe={stripePromise}>
            <Outlet />
          </Elements>
        ),
        children: [
          {
            path: "customer-details",
            element: <CustomerDetails />,
          },
          {
            path: "payment-form/:id",
            element: <PaymentForm />,
          },
          {
            path: "payment-success",
            element: <Paysucessmodel />,
          },
        ],
      },
    ],
  },
]);