import ColorConverter from "@/pages/color-pages/ColorConverter";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from ".";
import ColorGradientGeneratorPage from '@/pages/color-pages/ColorGradientGeneratorPage.tsx';

const colorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/color",
});

const colorConverterRoute = createRoute({
  getParentRoute: () => colorRoute,
  path: "/converter",
  component: ColorConverter,
});

const colorGradientGeneratorRoute = createRoute({
  getParentRoute: () => colorRoute,
  path: "/gradient-generator",
  component: ColorGradientGeneratorPage,
});

export { colorRoute, colorConverterRoute, colorGradientGeneratorRoute };