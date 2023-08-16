import sanityClient from "@sanity/client";


export const client = sanityClient({
    projectId: "zjb12jjg",
    dataset: "production",
    apiVersion: '2022-09-14',
    useCdn: true,
});