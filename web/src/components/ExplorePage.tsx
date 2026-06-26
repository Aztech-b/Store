import type { SanityDocument } from "@sanity/client";
import type { SanityImageSource } from "@sanity/image-url";
import { useLoaderData } from "react-router";
import { urlFor } from "./SanityClient";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

function ExplorePage() {
    const { products } = useLoaderData() as { products: SanityDocument[] };
    return (
        <main className="grid grid-cols-3 pt-20 mt-20">
            <div className="">
                <h2>Filter & Sort</h2>
            </div>
            <div className="grid grid-cols-3 mt-10 col-span-2 gap-2">
                {products.map((product) => (
                    <ProductCard key={product._id} title={product.name} img={product.image} />
                ))}
            </div>
        </main>
    );
}

function ProductCard({ title, img }: { title: string; img: SanityImageSource }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{img === null ? null : <img src={urlFor(img).url()} alt="" />}</CardContent>
        </Card>
    );
}

export default ExplorePage;
