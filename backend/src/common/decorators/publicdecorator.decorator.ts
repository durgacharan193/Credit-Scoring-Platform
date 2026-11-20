import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * PublicDecorator - bypass decorator skipping default JWT authentication checks
 */
@Injectable()
export class PublicDecorator {
  execute(...args: any[]): any {
    return true;
  }
}
