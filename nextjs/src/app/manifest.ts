import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Backcountry Maps",
    short_name: "BMaps",
    start_url: "/",
    display: "standalone",
    background_color: "#222b38",
    theme_color: "#222b38",
    orientation: "any",
    icons: [
      {
        src: "/logo_light.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo_light.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
