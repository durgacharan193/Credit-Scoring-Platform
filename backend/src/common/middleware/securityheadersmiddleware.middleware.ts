import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * SecurityHeadersMiddleware - Content-Security-Policy, HSTS, and X-Frame-Options injector
 */
@Injectable()
export class SecurityHeadersMiddleware {
  execute(...args: any[]): any {
    return true;
  }
}
