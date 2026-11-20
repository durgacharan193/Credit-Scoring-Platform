import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * RequestTimingMiddleware - Server-Timing response header performance tracer
 */
@Injectable()
export class RequestTimingMiddleware {
  execute(...args: any[]): any {
    return true;
  }
}
