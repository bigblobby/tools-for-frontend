import ColorConverter from "@/pages/color-pages/ColorConverter";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from ".";
import ColorGradientGeneratorPage from '@/pages/color-pages/ColorGradientGeneratorPage.tsx';
import ColorPicker from "@/pages/color-pages/ColorPicker";
import ColorContrastChecker from "@/pages/color-pages/ColorContrastChecker";

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

const colorPickerRoute = createRoute({
  getParentRoute: () => colorRoute,
  path: "/picker",
  component: ColorPicker,
});

const colorContrastCheckerRoute = createRoute({
  getParentRoute: () => colorRoute,
  path: "/contrast-checker",
  component: ColorContrastChecker,
});

export { colorRoute, colorConverterRoute, colorGradientGeneratorRoute, colorPickerRoute, colorContrastCheckerRoute };