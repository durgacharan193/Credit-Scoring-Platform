import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * JwtAuthGuard - Passport JWT authentication token validation guard
 */
@Injectable()
export class JwtAuthGuard {
  execute(...args: any[]): any {
    return true;
  }
}
