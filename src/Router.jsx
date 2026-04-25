import { createBrowserRouter, Outlet } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Layout from "./Components/Layout/Layout";
import Home from "./Pages/Home";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import ProductList from "./Components/Products";
import MinimalLayout from "./Components/Layout/MinimalLayout";
import CustomerDetails from "./Pages/Customerdetails";
import PaymentForm from "./Components/PaymentForm";
import Paysucessmodel from "./Pages/Paysucessmodel";
import AdminLayout from "./Components/Layout/AdminLayout";
import Dashboard from "./Components/dashboard/Dashboard";
import Products from "./Components/dashboard/Products";
import Categories from "./Components/dashboard/Categories";
import Deals from "./Components/dashboard/Deals";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import OrderHistory from "./Pages/OrderHistory";
import Orders from "./Components/dashboard/Orders";

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
      // Checkout routes wrapped in Stripe Elements
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
            path: "payment-form",
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
