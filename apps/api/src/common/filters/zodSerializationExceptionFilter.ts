import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ZodSerializationException } from 'nestjs-zod';
import { type ZodError } from 'zod';

@Catch(ZodSerializationException)
export class ZodSerializationExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(ZodSerializationExceptionFilter.name);

  catch(exception: ZodSerializationException, host: ArgumentsHost): void {
    const zodError = exception.getZodError() as ZodError;

    this.logger.error(
      'Response failed Zod serialization',
      JSON.stringify(zodError.issues),
    );

    super.catch(exception, host);
  }
}
