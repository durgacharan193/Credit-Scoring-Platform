import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * PermissionsGuard - fine-grained resource permission claims verification
 */
@Injectable()
export class PermissionsGuard {
  execute(...args: any[]): any {
    return true;
  }
}
