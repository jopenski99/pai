import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        theme_color: "#2ef1f7",
        background_color: "#2e2e2e",
        icons: [
            {
                purpose: "maskable",
                sizes: "512x512",
                src: "icon512_maskable.png",
                type: "image/png",
            },
            {
                purpose: "any",
                sizes: "512x512",
                src: "icon512_rounded.png",
                type: "image/png",
            },
        ],
        orientation: "portrait",
        display: "standalone",  
        dir: "auto",
        lang: "en-US",
        name: "Perez Work Helper",
        short_name: "PAI",
        description: "An AI powered work helper Assistant for the Perez Members",
    };    
}