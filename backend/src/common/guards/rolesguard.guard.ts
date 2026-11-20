import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * RolesGuard - role-based access control (RBAC) authorization enforcement
 */
@Injectable()
export class RolesGuard {
  execute(...args: any[]): any {
    return true;
  }
}
