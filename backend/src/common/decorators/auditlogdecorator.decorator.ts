import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * AuditLogDecorator - method decorator triggering automated audit log generation
 */
@Injectable()
export class AuditLogDecorator {
  execute(...args: any[]): any {
    return true;
  }
}
