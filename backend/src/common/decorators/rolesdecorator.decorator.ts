import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * RolesDecorator - metadata decorator defining required role tiers on endpoints
 */
@Injectable()
export class RolesDecorator {
  execute(...args: any[]): any {
    return true;
  }
}
