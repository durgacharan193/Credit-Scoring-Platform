import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * HttpExceptionFilter - RFC 7807 problem details exception response formatting
 */
@Injectable()
export class HttpExceptionFilter {
  execute(...args: any[]): any {
    return true;
  }
}
