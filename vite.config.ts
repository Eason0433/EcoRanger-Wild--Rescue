import { defineConfig } from "vite";

// base: "./" => relative asset paths, so the built site works whether it is
// served from a domain root (user.github.io) OR a project subpath
// (user.github.io/<repo>/). No need to hardcode the repo name.
export default defineConfig({
  base: "./",
});
