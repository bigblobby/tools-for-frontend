import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import Homepage from "@/pages/Homepage";
import BaseLayout from "@/layouts/base-layout";
import NotFoundPage from "@/pages/NotFoundPage";
import StringCountPage from "@/pages/string-pages/StringCountPage";
import StringTransformPage from "@/pages/string-pages/StringTransformPage";

const rootRoute = createRootRoute({
  component: BaseLayout,
  notFoundComponent: NotFoundPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Homepage,
});

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

const routeTree = rootRoute.addChildren([
  homeRoute,
  stringRoute.addChildren([stringCountRoute, stringTransformRoute]),
]);

export const router = createRouter({ routeTree });