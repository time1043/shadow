import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_main')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-2">
      <Outlet />
    </div>
  );
}
