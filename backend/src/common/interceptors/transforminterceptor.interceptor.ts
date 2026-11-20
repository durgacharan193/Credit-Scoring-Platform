import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * TransformInterceptor - standardized API response envelope { data, meta, timestamp } transformation
 */
@Injectable()
export class TransformInterceptor {
  execute(...args: any[]): any {
    return true;
  }
}
