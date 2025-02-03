import { createBrowserRouter } from "react-router-dom";
import App from "../loyout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catolog/Catalog";
import ProductDetails from "../../features/catolog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";

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
        ]
    }
], {
    future: {
        v7_relativeSplashPath: true
    }
})