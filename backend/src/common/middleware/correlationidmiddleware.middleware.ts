import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * CorrelationIdMiddleware - X-Correlation-ID distributed trace header injector
 */
@Injectable()
export class CorrelationIdMiddleware {
  execute(...args: any[]): any {
    return true;
  }
}
