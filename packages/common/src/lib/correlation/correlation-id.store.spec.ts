import { correlationIdStore } from './correlation-id.store';

describe('correlationIdStore', () => {
  it('returns undefined outside of a run()', () => {
    expect(correlationIdStore.getCorrelationId()).toBeUndefined();
  });

  it('exposes the correlation id set for the current run()', () => {
    correlationIdStore.run({ correlationId: 'abc-123' }, () => {
      expect(correlationIdStore.getCorrelationId()).toBe('abc-123');
    });
  });

  it('isolates concurrent runs from each other', async () => {
    const seen: string[] = [];

    await Promise.all([
      new Promise<void>((resolve) =>
        correlationIdStore.run({ correlationId: 'first' }, () =>
          setTimeout(() => {
            seen.push(correlationIdStore.getCorrelationId() as string);
            resolve();
          }, 10),
        ),
      ),
      new Promise<void>((resolve) =>
        correlationIdStore.run({ correlationId: 'second' }, () =>
          setTimeout(() => {
            seen.push(correlationIdStore.getCorrelationId() as string);
            resolve();
          }, 5),
        ),
      ),
    ]);

    expect(seen.sort()).toEqual(['first', 'second']);
  });
});
