import { createFileRoute } from '@tanstack/react-router';

import VocabularyPlay from './-components/VocabularyPlay';

export const Route = createFileRoute('/_main/vocabulary/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <VocabularyPlay />;
}
