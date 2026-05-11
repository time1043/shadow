import { atom } from 'jotai';

import type { ReviewStatus } from '@/types/ReviewStatus';

export const statusMapAtom = atom<Map<string, ReviewStatus>>(new Map());
