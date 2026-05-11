import { createFileRoute } from '@tanstack/react-router';

import EchoPlay from './-components/EchoPlay';

export const Route = createFileRoute('/_main/echo/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <EchoPlay />;
}
