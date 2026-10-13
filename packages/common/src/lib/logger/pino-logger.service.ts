import type { LoggerService } from '@nestjs/common';
import pino, { type Logger as Pino } from 'pino';
import { correlationIdStore } from '../correlation/correlation-id.store';

export class PinoLoggerService implements LoggerService {
  private readonly logger: Pino;

  constructor(serviceName: string) {
    this.logger = pino({
      name: serviceName,
      level: process.env['LOG_LEVEL'] ?? 'info',
    });
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.write('info', message, optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    this.write('error', message, optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.write('warn', message, optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.write('debug', message, optionalParams);
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.write('trace', message, optionalParams);
  }

  fatal(message: unknown, ...optionalParams: unknown[]): void {
    this.write('fatal', message, optionalParams);
  }

  private write(
    level: 'info' | 'error' | 'warn' | 'debug' | 'trace' | 'fatal',
    message: unknown,
    optionalParams: unknown[],
  ): void {
    const correlationId = correlationIdStore.getCorrelationId();
    const context = optionalParams[optionalParams.length - 1];
    this.logger[level]({ correlationId, context }, String(message));
  }
}
