import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { correlationIdStore } from '../correlation/correlation-id.store';

interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  correlationId?: string;
}

@Catch()
export class ProblemDetailsExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemDetailsExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, title, detail } = this.describe(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        exception instanceof Error ? exception.stack : exception,
      );
    }

    const problem: ProblemDetails = {
      type: 'about:blank',
      title,
      status,
      detail,
      instance: request.url,
      correlationId: correlationIdStore.getCorrelationId(),
    };

    response
      .status(status)
      .contentType('application/problem+json')
      .send(problem);
  }

  private describe(exception: unknown): {
    status: number;
    title: string;
    detail: string;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const detail =
        typeof body === 'string'
          ? body
          : ((body as Record<string, unknown>)['message'] ?? exception.message);

      return {
        status,
        title: toTitleCase(HttpStatus[status] ?? exception.name),
        detail: Array.isArray(detail) ? detail.join(', ') : String(detail),
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      title: 'Internal Server Error',
      detail: 'An unexpected error occurred.',
    };
  }
}

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
