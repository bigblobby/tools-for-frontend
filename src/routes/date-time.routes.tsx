import { createRoute } from "@tanstack/react-router";
import { rootRoute } from ".";
import DateTimeEpochUnitPage from '@/pages/date-time-pages/DateTimeEpochUnitPage.tsx';

const dateTimeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/date-time",
});

const epochUnixDateTimeRoute = createRoute({
  getParentRoute: () => dateTimeRoute,
  path: "/epoch-unix",
  component: DateTimeEpochUnitPage,
});

export { dateTimeRoute, epochUnixDateTimeRoute };