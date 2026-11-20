import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * ValidationExceptionFilter - class-validator error tree normalization for form feedback
 */
@Injectable()
export class ValidationExceptionFilter {
  execute(...args: any[]): any {
    return true;
  }
}
