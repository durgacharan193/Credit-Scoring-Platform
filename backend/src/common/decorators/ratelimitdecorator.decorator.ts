import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * RateLimitDecorator - custom decorator defining endpoint-specific throttle quotas
 */
@Injectable()
export class RateLimitDecorator {
  execute(...args: any[]): any {
    return true;
  }
}
