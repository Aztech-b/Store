import type { SanityDocument } from "@sanity/client";
import type { ProductData } from "@store/shared";
import { useState } from "react";
import { Link, useLoaderData, useNavigate, useSearchParams } from "react-router";
import { urlFor } from "./SanityClient";
import { Button } from "./ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "./ui/field";
import { Pagination } from "./ui/pagination";
import { Slider } from "./ui/slider";

function ExplorePage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate();
    if (params.get("page") === null) {
        navigate("/explore?page-1");
    }
    const { products, categories, price } = useLoaderData() as {
        products: (SanityDocument & ProductData)[];
        categories: string[];
        price: { min: number; max: number };
    };
    const [priceSliderValue, setPriceSliderValue] = useState([price.min, price.max]);
    // const [categoryFilter, setCategoryFilter] = useState([]);
    return (
        <main className="grid grid-cols-3 pt-20 mt-20 gap-10">
            <div className="">
                <Card>
                    <CardHeader>
                        <CardTitle>Filter & Sort</CardTitle>
                        <CardAction>
                            <Button variant={"ghost"} size={"sm"}>
                                Reset
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <FieldSet>
                            <FieldGroup className="gap-2">
                                {categories.map((category) => (
                                    <Field key={category} orientation={"horizontal"}>
                                        <Checkbox id={category}></Checkbox>
                                        <FieldLabel>{category}</FieldLabel>
                                    </Field>
                                ))}
                            </FieldGroup>
                            <FieldGroup className="mt-6">
                                <Field>
                                    <div className="flex justify-between items-center">
                                        <FieldLegend className="m-0">Price</FieldLegend>
                                        <p>{`MIN: ${priceSliderValue[0]}  MAX: ${priceSliderValue[1]}`}</p>
                                    </div>

                                    <Slider
                                        step={1}
                                        min={price.min}
                                        max={price.max}
                                        onValueChange={setPriceSliderValue}
                                        value={priceSliderValue}
                                    />
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Filter
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="mt-10 col-start-2 col-span-2">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
                    {products.map((product) => (
                        <ProductCard key={product._id} data={product} />
                    ))}
                </div>
                <Pagination></Pagination>
            </div>
        </main>
    );
}

function ProductCard({ data }: { data: SanityDocument & ProductData }) {
    return (
        <Card className="pt-0" size="sm">
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
