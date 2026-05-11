import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import BreakpointIndicator from '@/components/BreakpointIndicator';

const RootLayout = () => (
  <>
    <Outlet />
    <BreakpointIndicator />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
