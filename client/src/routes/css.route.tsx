import { createRoute } from "@tanstack/react-router";
import { rootRoute } from ".";
import CssBoxShadowPage from '@/pages/css-pages/CssBoxShadowPage.tsx';
import CubicBezierPage from '@/pages/css-pages/CubicBezierPage.tsx';

const cssRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/css",
});

const boxShadowRoute = createRoute({
  getParentRoute: () => cssRoute,
  path: "/box-shadow",
  component: CssBoxShadowPage,
});

const cubicBezierRoute = createRoute({
  getParentRoute: () => cssRoute,
  path: "/cubic-bezier",
  component: CubicBezierPage,
});

export { cssRoute, boxShadowRoute, cubicBezierRoute };