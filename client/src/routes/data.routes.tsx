import { createRoute } from "@tanstack/react-router";
import { rootRoute } from ".";
import XmlToJsonConverter from "@/pages/data-pages/XmlToJsonConverter";
import JsonToXmlConverterPage from "@/pages/data-pages/JsonToXmlConverterPage";
import JSONFormatterPage from '@/pages/data-pages/JSONFormatterPage.tsx';
import JWTDecoderPage from '@/pages/data-pages/JWTDecoderPage.tsx';
import JsonToCsvConverterPage from "@/pages/data-pages/JsonToCsvConverterPage";
import CsvToJsonConverterPage from "@/pages/data-pages/CsvToJsonConverterPage";

const dataRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/data",
});

const xmlToJsonConverterRoute = createRoute({
  getParentRoute: () => dataRoute,
  path: "/xml-to-json",
  component: XmlToJsonConverter,
});

const jsonToXmlConverterRoute = createRoute({
  getParentRoute: () => dataRoute,
  path: "/json-to-xml",
  component: JsonToXmlConverterPage,
});

const jsonFormatterRoute = createRoute({
  getParentRoute: () => dataRoute,
  path: "/json-formatter",
  component: JSONFormatterPage,
});

const jwtDecoderRoute = createRoute({
  getParentRoute: () => dataRoute,
  path: "/jwt-decoder",
  component: JWTDecoderPage,
});

const jsonToCsvConverterRoute = createRoute({
  getParentRoute: () => dataRoute,
  path: "/json-to-csv",
  component: JsonToCsvConverterPage,
});

const csvToJsonConverterRoute = createRoute({
  getParentRoute: () => dataRoute,
  path: "/csv-to-json",
  component: CsvToJsonConverterPage,
});

export { dataRoute, xmlToJsonConverterRoute, jsonToXmlConverterRoute, jsonFormatterRoute, jwtDecoderRoute, jsonToCsvConverterRoute, csvToJsonConverterRoute };