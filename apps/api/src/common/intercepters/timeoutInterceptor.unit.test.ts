/* eslint-disable @typescript-eslint/unbound-method */
import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { RequestTimeoutException } from '@nestjs/common';
import { firstValueFrom, never, of, throwError } from 'rxjs';
import { TimeoutInterceptor } from './timeoutInterceptor';

describe('TimeoutInterceptor', () => {
  let interceptor: TimeoutInterceptor;
  let context: ExecutionContext;

  beforeEach(() => {
    interceptor = new TimeoutInterceptor();
    context = {} as ExecutionContext;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('intercept', () => {
    it('returns the value emitted by the handler', async () => {
      const next: jest.Mocked<CallHandler> = {
        handle: jest.fn().mockReturnValue(of('response')),
      };

      const result = await firstValueFrom(interceptor.intercept(context, next));

      expect(result).toBe('response');
      expect(next.handle).toHaveBeenCalledTimes(1);
    });

    it('throws RequestTimeoutException when the handler exceeds the timeout', async () => {
      jest.useFakeTimers();

      const next: jest.Mocked<CallHandler> = {
        handle: jest.fn().mockReturnValue(never()),
      };

      const resultPromise = firstValueFrom(interceptor.intercept(context, next));

      const expectation = expect(resultPromise).rejects.toMatchObject({
        message: 'The request took too long to complete.',
      });

      await jest.advanceTimersByTimeAsync(10_000);

      await expectation;
      await expect(resultPromise).rejects.toBeInstanceOf(RequestTimeoutException);

      expect(next.handle).toHaveBeenCalledTimes(1);
    });

    it('rethrows errors that are not timeout errors', async () => {
      const originalError = new Error('Something failed');

      const next: jest.Mocked<CallHandler> = {
        handle: jest.fn().mockReturnValue(throwError(() => originalError)),
      };

      const resultPromise = firstValueFrom(interceptor.intercept(context, next));

      await expect(resultPromise).rejects.toBe(originalError);
      expect(next.handle).toHaveBeenCalledTimes(1);
    });
  });
});
