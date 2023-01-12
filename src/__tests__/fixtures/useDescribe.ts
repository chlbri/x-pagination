import { afterAll, beforeAll, vi } from 'vitest';

export function useFakeTime() {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });
}
