import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import Homepage from "@/pages/Homepage";
import BaseLayout from "@/layouts/base-layout";
import NotFoundPage from "@/pages/NotFoundPage";
import { stringRoute, stringCountRoute, stringTransformRoute, stringEncodeDecodeRoute, stringHashGeneratorRoute, stringCaseConverterRoute } from "@/routes/string.routes";
import { colorRoute, colorConverterRoute } from "@/routes/color.routes";

export const rootRoute = createRootRoute({
  component: BaseLayout,
  notFoundComponent: NotFoundPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Homepage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  stringRoute.addChildren([stringCountRoute, stringTransformRoute, stringEncodeDecodeRoute, stringHashGeneratorRoute, stringCaseConverterRoute]),
  colorRoute.addChildren([colorConverterRoute]),
]);

export const router = createRouter({ routeTree });