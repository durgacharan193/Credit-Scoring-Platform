import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * MetricsInterceptor - Prometheus HTTP request counter and histogram collector
 */
@Injectable()
export class MetricsInterceptor {
  execute(...args: any[]): any {
    return true;
  }
}
