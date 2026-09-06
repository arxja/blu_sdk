import { defineConfig } from "tsup";

const external = ["react", "react-dom", "next", "next/navigation"];

export default defineConfig([
  {
    name: "client",
    entry: { index: "src/index.ts" },
    format: ["cjs", "esm"],
    dts: true,
    clean: true, // only the first build should clean dist
    sourcemap: true,
    minify: false, // let consuming apps minify; keeps stacks/debugging sane
    splitting: false, // avoid shared chunks so the banner stays on top of the single output file
    external,
    banner: { js: "'use client';" }, // static — applies to every chunk in THIS build only
  },
  {
    name: "server",
    entry: { server: "src/server.ts" },
    format: ["cjs", "esm"],
    dts: true,
    clean: false, // don't wipe out the client build's output
    sourcemap: true,
    minify: false,
    external,
    // no banner here
  },
]);
