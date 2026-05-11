import { createFileRoute } from '@tanstack/react-router';

import VocabularySummary from './-components/VocabularySummary';

export const Route = createFileRoute('/_main/vocabulary/summary')({
  component: RouteComponent,
});

function RouteComponent() {
  return <VocabularySummary />;
}
