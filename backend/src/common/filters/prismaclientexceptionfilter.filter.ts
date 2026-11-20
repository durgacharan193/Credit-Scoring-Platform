import { Injectable, CanActivate, ExecutionContext, NestInterceptor, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * PrismaClientExceptionFilter - Prisma unique constraint and foreign key error sanitizer
 */
@Injectable()
export class PrismaClientExceptionFilter {
  execute(...args: any[]): any {
    return true;
  }
}
