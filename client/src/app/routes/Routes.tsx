import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../loyout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catolog/Catalog";
import ProductDetails from "../../features/catolog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import ServerError from "../../app/errors/ServerError";
import NotFound from "../../app/errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import LoginForm from "../../features/account/LoginForm";
import RegisterForm from "../../features/account/RegisterForm";
import RequireAuth from "./RequireAuth";
import CheckoutSuccess from "../../features/checkout/CheckoutSuccess";
import OrdersPage from "../../features/orders/OrderPage";
import OrderdetailedPage from "../../features/orders/OrderDetailedPage";
import InventoryPage from "../../features/admin/InventoryPage";



export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {element: <RequireAuth/>, children: [
                {path: 'checkout', element: <CheckoutPage />},
                {path: 'checkout/success', element: <CheckoutSuccess />},
                {path: 'orders', element: <OrdersPage />},
                {path: 'orders/:id', element: <OrderdetailedPage />},
                {path: 'inventory', element: <InventoryPage />}

            ]},
            {path: '', element: <HomePage />},
            {path: 'catalog', element: <Catalog />},
            {path: 'catalog/:id', element: <ProductDetails />},
            {path: 'about', element: <AboutPage />},
            {path: 'contact', element: <ContactPage />},
            {path: 'basket', element: <BasketPage />},
            {path: 'server-error', element: <ServerError />},
            {path: 'login', element: <LoginForm />},
            {path: 'register', element: <RegisterForm />},
            {path: 'not-found', element: <NotFound />},
            {path: '*', element: <Navigate replace to='/not-found' />},
        ]
    }
], {
    future: {
        v7_relativeSplashPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7skipActionErrorRevalidation: true
    }
})
