import { createClient } from "@sanity/client";
import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

export const client = createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: "production",
    apiVersion: "2026-06-26",
    useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
    return builder.image(source);
}
