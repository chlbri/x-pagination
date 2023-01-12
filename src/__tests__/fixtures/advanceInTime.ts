import { vi } from 'vitest';

export async function advanceInTime(ms = 200) {
  await Promise.resolve();
  vi.advanceTimersByTime(ms);
}
