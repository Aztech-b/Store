import type { SanityDocument } from "@sanity/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App.tsx";
import LandingPage from "./components/LandingPage.tsx";
import { client } from "./components/SanityClient.ts";
import "./index.css";
import "./main.css";

const POSTS_QUERY = `*[_type == "product"] {
    name,
    image,
    customOptions[] {
        title,
        values
    }
}`;

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        loader: async () => {
            return { products: await client.fetch<SanityDocument[]>(POSTS_QUERY) };
        },
        children: [{ index: true, element: <LandingPage></LandingPage> }],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
