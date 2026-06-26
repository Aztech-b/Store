import type { SanityDocument } from "@sanity/client";
import type { SanityImageSource } from "@sanity/image-url";
import { Outlet, useLoaderData } from "react-router";
import NavBar from "./components/NavBar";
import { urlFor } from "./components/SanityClient";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { ThemeProvider } from "./hooks/useTheme";

function App() {
    const { products } = useLoaderData() as { products: SanityDocument[] };
    console.log(products);
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="min-w-screen flex justify-center">
                <div className="max-w-max-content w-full">
                    <NavBar />
                    <Outlet></Outlet>
                    {products?.map((product, index: number) => (
                        <ProductCard key={index} title={product.name} img={product.image}></ProductCard>
                    ))}
                </div>
            </div>
        </ThemeProvider>
    );
}

function ProductCard({ title, img }: { title: string; img: SanityImageSource }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <img src={img === null ? "" : urlFor(img).url()} alt="" />
            </CardContent>
        </Card>
    );
}

export default App;
