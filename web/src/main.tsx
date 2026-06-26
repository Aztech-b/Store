import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App.tsx";
import LandingPage from "./components/LandingPage.tsx";
import "./index.css";
import "./main.css";

const router = createBrowserRouter([
    { path: "/", element: <App />, children: [{ index: true, element: <LandingPage></LandingPage> }] },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
