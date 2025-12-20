import { createRoute } from "@tanstack/react-router";
import { rootRoute } from ".";

const numberRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/number",
});

export { numberRoute };