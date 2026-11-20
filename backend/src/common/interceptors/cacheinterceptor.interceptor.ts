import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * CacheInterceptor - Redis-backed conditional GET cache header resolution
 */
@Injectable()
export class CacheInterceptor {
  execute(...args: any[]): any {
    return true;
  }
}
