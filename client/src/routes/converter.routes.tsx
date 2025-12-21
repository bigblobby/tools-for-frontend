import { createRoute } from "@tanstack/react-router";
import { rootRoute } from ".";
import XmlToJsonConverter from "@/pages/converter-pages/XmlToJsonConverter";
import JsonToXmlConverterPage from '@/pages/converter-pages/JsonToXmlConverterPage.tsx';

const converterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/converter",
});

const xmlToJsonConverterRoute = createRoute({
  getParentRoute: () => converterRoute,
  path: "/xml-to-json",
  component: XmlToJsonConverter,
});

const jsonToXmlConverterRoute = createRoute({
  getParentRoute: () => converterRoute,
  path: "/json-to-xml",
  component: JsonToXmlConverterPage,
});

export { converterRoute, xmlToJsonConverterRoute, jsonToXmlConverterRoute };