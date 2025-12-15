import ColorConverter from "@/pages/color-pages/ColorConverter";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from ".";

const colorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/color",
});

const colorConverterRoute = createRoute({
  getParentRoute: () => colorRoute,
  path: "/converter",
  component: ColorConverter,
});

export { colorRoute, colorConverterRoute };