import { createRoute } from "@tanstack/react-router";
import { rootRoute } from ".";
import XmlToJsonConverter from "@/pages/converter-pages/XmlToJsonConverter";

const converterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/converter",
});

const xmlToJsonConverterRoute = createRoute({
  getParentRoute: () => converterRoute,
  path: "/xml-to-json",
  component: XmlToJsonConverter,
});

export { converterRoute, xmlToJsonConverterRoute };