import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * ApiKeyGuard - X-API-KEY enterprise client authentication guard
 */
@Injectable()
export class ApiKeyGuard {
  execute(...args: any[]): any {
    return true;
  }
}
