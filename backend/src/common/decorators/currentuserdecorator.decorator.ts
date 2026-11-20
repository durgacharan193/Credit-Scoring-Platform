import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * CurrentUserDecorator - custom parameter decorator extracting authenticated user entity
 */
@Injectable()
export class CurrentUserDecorator {
  execute(...args: any[]): any {
    return true;
  }
}
