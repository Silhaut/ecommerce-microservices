import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { correlationIdStore } from './correlation-id.store';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const correlationId = req.header(CORRELATION_ID_HEADER) || randomUUID();

    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    correlationIdStore.run({ correlationId }, next);
  }
}
