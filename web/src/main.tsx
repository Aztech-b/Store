import type { SanityDocument } from "@sanity/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App.tsx";
import ExplorePage from "./components/ExplorePage.tsx";
import LandingPage from "./components/LandingPage.tsx";
import { client } from "./components/SanityClient.ts";
import "./index.css";
import "./main.css";

const POSTS_QUERY = `*[_type == "product"] {
    _id, 
    name,
    image,
    description, 
    category, 
    price, 
    customOptions[] {
        title,
        values
    }
}`;

const CATEGORIES_QUERY = `array::unique(*[_type == "product" && defined(category)].category)`;

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <LandingPage></LandingPage> },
            {
                path: "/explore",
                element: <ExplorePage />,
                loader: async () => {
                    return {
                        products: await client.fetch<SanityDocument[]>(POSTS_QUERY),
                        categories: await client.fetch<SanityDocument[]>(CATEGORIES_QUERY),
                    };
                },
            },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
