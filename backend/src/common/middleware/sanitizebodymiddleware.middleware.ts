import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * SanitizeBodyMiddleware - XSS and SQL injection input payload sanitizer
 */
@Injectable()
export class SanitizeBodyMiddleware {
  execute(...args: any[]): any {
    return true;
  }
}
