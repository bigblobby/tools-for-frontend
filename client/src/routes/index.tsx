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
import { colorRoute, colorConverterRoute, colorGradientGeneratorRoute } from '@/routes/color.routes';
import { numberRoute } from "@/routes/number.routes";
import { converterRoute, xmlToJsonConverterRoute, jsonToXmlConverterRoute } from "@/routes/converter.routes";
import { dateTimeRoute, epochUnixDateTimeRoute } from '@/routes/date-time.routes.tsx';
import {
  faviconGeneratorRoute,
  imageOptimiserRoute,
  imagePlaceholderGeneratorRoute,
  imageRoute,
  imageToBase64Route
} from '@/routes/image.routes.tsx';
import { cssRoute, boxShadowRoute } from '@/routes/css.route.tsx';

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
  colorRoute.addChildren([colorConverterRoute, colorGradientGeneratorRoute]),
  cssRoute.addChildren([boxShadowRoute]),
  numberRoute.addChildren([]),
  converterRoute.addChildren([xmlToJsonConverterRoute, jsonToXmlConverterRoute]),
  dateTimeRoute.addChildren([epochUnixDateTimeRoute]),
  imageRoute.addChildren([imageToBase64Route, imageOptimiserRoute, imagePlaceholderGeneratorRoute, faviconGeneratorRoute])
]);

export const router = createRouter({ routeTree });