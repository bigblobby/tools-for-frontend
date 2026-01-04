import { createRoute } from "@tanstack/react-router";
import { rootRoute } from ".";
import ImageToBase64Page from '@/pages/image-pages/ImageToBase64Page.tsx';
import ImageOptimiserPage from '@/pages/image-pages/ImageOptimiserPage.tsx';
import ImagePlaceholderGeneratorPage from '@/pages/image-pages/ImagePlaceholderGeneratorPage.tsx';
import FaviconGeneratorPage from '@/pages/image-pages/FaviconGeneratorPage.tsx';

const imageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/image",
});

const imageToBase64Route = createRoute({
  getParentRoute: () => imageRoute,
  path: "/base64",
  component: ImageToBase64Page,
});

const imageOptimiserRoute = createRoute({
  getParentRoute: () => imageRoute,
  path: "/optimise",
  component: ImageOptimiserPage,
});

const imagePlaceholderGeneratorRoute = createRoute({
  getParentRoute: () => imageRoute,
  path: "/placeholder",
  component: ImagePlaceholderGeneratorPage,
});

const faviconGeneratorRoute = createRoute({
  getParentRoute: () => imageRoute,
  path: "/favicon-generator",
  component: FaviconGeneratorPage,
});

export { imageRoute, imageToBase64Route, imageOptimiserRoute, imagePlaceholderGeneratorRoute, faviconGeneratorRoute };