import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../loyout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catolog/Catalog";
import ProductDetails from "../../features/catolog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import ServerError from "../../app/errors/ServerError";
import NotFound from "../../app/errors/NotFound";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {path: '', element: <HomePage />},
            {path: '/catalog', element: <Catalog />},
            {path: '/catalog/:id', element: <ProductDetails />},
            {path: '/about', element: <AboutPage />},
            {path: '/contact', element: <ContactPage />},
            {path: '/server-error', element: <ServerError />},
            {path: '/not-found', element: <NotFound />},
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
