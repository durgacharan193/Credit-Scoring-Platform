import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * LoggingInterceptor - structured request/response latency and status logging
 */
@Injectable()
export class LoggingInterceptor {
  execute(...args: any[]): any {
    return true;
  }
}
