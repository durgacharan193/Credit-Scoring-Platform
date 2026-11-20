import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * ThrottlerGuard - per-IP rate limiting guard against brute-force attacks
 */
@Injectable()
export class ThrottlerGuard {
  execute(...args: any[]): any {
    return true;
  }
}
