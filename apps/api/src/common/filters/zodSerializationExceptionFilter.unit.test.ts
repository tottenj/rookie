import type { ArgumentsHost } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ZodSerializationException } from 'nestjs-zod';
import { z } from 'zod';

import { ZodSerializationExceptionFilter } from './zodSerializationExceptionFilter';

describe('ZodSerializationExceptionFilter', () => {
  let filter: ZodSerializationExceptionFilter;

  beforeEach(() => {
    filter = new ZodSerializationExceptionFilter();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('catch', () => {
    it('logs the Zod serialization error and delegates to the base filter', () => {
      const schema = z.object({
        id: z.string(),
      });

      const result = schema.safeParse({
        id: 123,
      });

      if (result.success) {
        throw new Error('Expected schema parsing to fail');
      }

      const exception = new ZodSerializationException(result.error);
      const host = {} as ArgumentsHost;

      const loggerSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation();

      const baseCatchSpy = jest
        .spyOn(BaseExceptionFilter.prototype, 'catch')
        .mockImplementation();

      filter.catch(exception, host);

      expect(loggerSpy).toHaveBeenCalledWith(
        'Response failed Zod serialization',
        JSON.stringify(result.error.issues),
      );

      expect(baseCatchSpy).toHaveBeenCalledWith(exception, host);
    });
  });
});