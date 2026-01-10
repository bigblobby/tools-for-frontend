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
  stringLoremIpsumRoute,
} from '@/routes/string.routes';
import { colorRoute, colorConverterRoute, colorGradientGeneratorRoute, colorPickerRoute, colorContrastCheckerRoute } from '@/routes/color.routes';
import { numberRoute } from "@/routes/number.routes";
import { dateTimeRoute, epochUnixDateTimeRoute } from '@/routes/date-time.routes.tsx';
import {
  faviconGeneratorRoute,
  imageOptimiserRoute,
  imagePlaceholderGeneratorRoute,
  imageRoute,
  imageToBase64Route
} from '@/routes/image.routes.tsx';
import { cssRoute, boxShadowRoute } from '@/routes/css.route.tsx';
import { dataRoute, jsonToXmlConverterRoute, xmlToJsonConverterRoute, jsonFormatterRoute, jwtDecoderRoute, jsonToCsvConverterRoute, csvToJsonConverterRoute } from '@/routes/data.routes.tsx';

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
  stringRoute.addChildren([stringCountRoute, stringTransformRoute, stringEncodeDecodeRoute, stringHashGeneratorRoute, stringCaseConverterRoute, stringLoremIpsumRoute]),
  colorRoute.addChildren([colorConverterRoute, colorGradientGeneratorRoute, colorPickerRoute, colorContrastCheckerRoute]),
  cssRoute.addChildren([boxShadowRoute]),
  numberRoute.addChildren([]),
  dataRoute.addChildren([xmlToJsonConverterRoute, jsonToXmlConverterRoute, jsonFormatterRoute, jwtDecoderRoute, jsonToCsvConverterRoute, csvToJsonConverterRoute]),
  dateTimeRoute.addChildren([epochUnixDateTimeRoute]),
  imageRoute.addChildren([imageToBase64Route, imageOptimiserRoute, imagePlaceholderGeneratorRoute, faviconGeneratorRoute])
]);

export const router = createRouter({ routeTree });