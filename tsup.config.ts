import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/scheduler/index.ts",
    "src/world/index.ts",
    "src/dependencies-management/index.ts",
    "src/input-from-devices/index.ts",
    "src/ui/index.ts",
    "src/effects/index.ts",
    "src/*.ts",
  ],
  splitting: true,
  // target: "es5",
  //   format: ["esm"],
  dts: true,
  treeshake: true,
  bundle: true,
  clean: true,
});
