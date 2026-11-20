import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * MaintenanceGuard - scheduled system maintenance mode interceptor
 */
@Injectable()
export class MaintenanceGuard {
  execute(...args: any[]): any {
    return true;
  }
}
