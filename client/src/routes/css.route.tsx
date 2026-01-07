import { createRoute } from "@tanstack/react-router";
import { rootRoute } from ".";
import CssBoxShadowPage from '@/pages/css-pages/CssBoxShadowPage.tsx';

const cssRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/css",
});

const boxShadowRoute = createRoute({
  getParentRoute: () => cssRoute,
  path: "/box-shadow",
  component: CssBoxShadowPage,
});

export { cssRoute, boxShadowRoute };