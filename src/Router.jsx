import { createBrowserRouter } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Pages/Home";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import MinimalLayout from "./Components/Layout/MiniLaout";
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
import ProtectedRoute from "./Components/Auth/ProtectedRoute";



export const route = createBrowserRouter(
    [
        {
            path: '/',
            element: <Layout />,
            children: [
                {
                    path: '/',
                    element: <Home />
                },
                {
                    path: 'product/:id',
                    element: <ProductDetails />
                },
                {
                    path: 'cart/',
                    element: <Cart />
                }
            ]

        },
        {
            path: '/admin-dashboard',
            element: (
                <ProtectedRoute adminOnly={true}>
                    <AdminLayout />
                </ProtectedRoute>
            ),
            children: [
                {
                    index: true,
                    element: <Dashboard />
                },
                {
                    path: 'products',
                    element: <Products />
                },
                {
                    path: 'categories',
                    element: <Categories />
                },
                {
                    path: 'deals',
                    element: <Deals />
                },
            ]

        },
        {
            path: '/',
            element: <MinimalLayout />,
            children: [
                {
                    path: 'customer-details/',
                    element: <CustomerDetails />
                },
                {
                    path: 'payment-form/',
                    element: <PaymentForm />
                },
                {
                    path: 'payment-success/',
                    element: <Paysucessmodel />
                },
                {
                    path: 'login/',
                    element: <Login />
                },
                {
                    path: 'register/',
                    element: <Register />
                }
            ]
        }
    ]
)

