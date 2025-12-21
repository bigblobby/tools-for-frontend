import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import Homepage from "@/pages/Homepage";
import BaseLayout from "@/layouts/base-layout";
import NotFoundPage from "@/pages/NotFoundPage";
import {
  stringRoute,
  stringCountRoute,
  stringTransformRoute,
  stringEncodeDecodeRoute,
  stringHashGeneratorRoute,
  stringCaseConverterRoute,
  stringJWTDecoderRoute,
  stringJSONFormatterRoute
} from '@/routes/string.routes';
import { colorRoute, colorConverterRoute } from "@/routes/color.routes";
import { numberRoute } from "@/routes/number.routes";
import { converterRoute, xmlToJsonConverterRoute } from "@/routes/converter.routes";
import { dateTimeRoute, epochUnixDateTimeRoute } from '@/routes/date-time.routes.tsx';

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
  stringRoute.addChildren([stringCountRoute, stringTransformRoute, stringEncodeDecodeRoute, stringHashGeneratorRoute, stringCaseConverterRoute, stringJSONFormatterRoute, stringJWTDecoderRoute]),
  colorRoute.addChildren([colorConverterRoute]),
  numberRoute.addChildren([]),
  converterRoute.addChildren([xmlToJsonConverterRoute]),
  dateTimeRoute.addChildren([epochUnixDateTimeRoute]),
]);

export const router = createRouter({ routeTree });