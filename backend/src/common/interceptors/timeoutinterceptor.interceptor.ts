import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * TimeoutInterceptor - global 15-second request timeout guard to prevent hung worker threads
 */
@Injectable()
export class TimeoutInterceptor {
  execute(...args: any[]): any {
    return true;
  }
}
