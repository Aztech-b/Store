import type { SanityDocument } from "@sanity/client";
import type { SanityImageSource } from "@sanity/image-url";
import { Link, useLoaderData } from "react-router";
import { urlFor } from "./SanityClient";
import { Button } from "./ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldLabel } from "./ui/field";

type ProductData = {
    name: string;
    description: string;
    price: number;
    image: SanityImageSource;
    category: string | "t-shirt" | "accessories" | "hats" | "sneakers";
};

function ExplorePage() {
    const { products } = useLoaderData() as {
        products: (SanityDocument & ProductData)[];
        categories: SanityDocument[];
    };
    return (
        <main className="grid grid-cols-3 pt-20 mt-20 gap-10">
            <div className="">
                <Card>
                    <CardHeader>
                        <CardTitle>Filter & Sort</CardTitle>
                        <CardAction>
                            <Button variant={"outline"} size={"sm"}>
                                Reset
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Field>
                            <FieldLabel>Price</FieldLabel>
                        </Field>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-3 mt-10 col-span-2 gap-2">
                {products.map((product) => (
                    <ProductCard key={product._id} data={product} />
                ))}
            </div>
        </main>
    );
}

function ProductCard({ data }: { data: SanityDocument & ProductData }) {
    return (
        <Card className="pt-0">
            {data.image === null ? null : <img src={urlFor(data.image).url()} alt="" />}
            <CardHeader>
                <CardTitle>{data.name}</CardTitle>
                <CardAction>
                    <p className="text-emerald-400">{`${data.price}$`}</p>
                </CardAction>
                <CardDescription>{data.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col gap-2">
                <Link className="w-full" to={`/product/:${data._id}`}>
                    <Button className="w-full">Product Page</Button>
                </Link>
                <Button variant={"outline"} className="w-full">
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ExplorePage;
