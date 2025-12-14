import { createRoute } from "@tanstack/react-router";
import { rootRoute } from ".";
import StringCountPage from "@/pages/string-pages/StringCountPage";
import StringTransformPage from "@/pages/string-pages/StringTransformPage";
import StringEncodeDecodePage from "@/pages/string-pages/StringEncodeDecodePage";
import StringHashGeneratorPage from "@/pages/string-pages/StringHashGeneratorPage";

const stringRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/string",
});

const stringCountRoute = createRoute({
  getParentRoute: () => stringRoute,
  path: "/count",
  component: StringCountPage,
});

const stringTransformRoute = createRoute({
  getParentRoute: () => stringRoute,
  path: "/transform",
  component: StringTransformPage,
});

const stringEncodeDecodeRoute = createRoute({
  getParentRoute: () => stringRoute,
  path: "/encode-decode",
  component: StringEncodeDecodePage,
});

const stringHashGeneratorRoute = createRoute({
  getParentRoute: () => stringRoute,
  path: "/hash-generator",
  component: StringHashGeneratorPage,
});

export { stringRoute, stringCountRoute, stringTransformRoute, stringEncodeDecodeRoute, stringHashGeneratorRoute };