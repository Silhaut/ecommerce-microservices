import { AsyncLocalStorage } from 'node:async_hooks';

export interface CorrelationContext {
  correlationId: string;
}

const storage = new AsyncLocalStorage<CorrelationContext>();

export const correlationIdStore = {
  run<T>(context: CorrelationContext, fn: () => T): T {
    return storage.run(context, fn);
  },

  getCorrelationId(): string | undefined {
    return storage.getStore()?.correlationId;
  },
};
