// http-exception.filter
import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ZodSerializationException } from 'nestjs-zod';

@Catch(ZodSerializationException)
export class ZodSerializationExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(ZodSerializationExceptionFilter.name);

  catch(exception: ZodSerializationException, host: ArgumentsHost): void {
    const zodError = exception.getZodError();

    if (zodError instanceof ZodSerializationException) {
      this.logger.error('Response failed Zod serialization', JSON.stringify(zodError.message));
    }

    super.catch(exception, host);
  }
}
