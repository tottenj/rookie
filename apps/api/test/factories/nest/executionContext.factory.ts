import type { ExecutionContext, Type } from '@nestjs/common';
import type { Request, Response } from 'express';

type RouteHandler = (...args: unknown[]) => unknown;

type ExecutionContextFactoryOptions<TRequest extends Request> = {
  request?: Partial<TRequest>;
  response?: Partial<Response>;
  handler?: RouteHandler;
  controller?: Type<unknown>;
};

type HttpExecutionContextFactoryResult<TRequest extends Request> = {
  context: ExecutionContext;
  request: TRequest;
  response: Response;
};

export function createHttpExecutionContext<TRequest extends Request = Request>(
  options: ExecutionContextFactoryOptions<TRequest> = {},
): HttpExecutionContextFactoryResult<TRequest> {
  const request = {
    headers: {},
    ...options.request,
  } as TRequest;

  const response = {
    ...options.response,
  } as Response;

  const handler = options.handler ?? jest.fn();
  const controller = options.controller ?? class TestController {};

  const httpArgumentsHost = {
    getRequest: jest.fn().mockReturnValue(request),
    getResponse: jest.fn().mockReturnValue(response),
    getNext: jest.fn(),
  };

  const context = {
    getHandler: jest.fn().mockReturnValue(handler),
    getClass: jest.fn().mockReturnValue(controller),
    switchToHttp: jest.fn().mockReturnValue(httpArgumentsHost),
    getType: jest.fn().mockReturnValue('http'),
    getArgs: jest.fn().mockReturnValue([request, response]),
    getArgByIndex: jest.fn((index: number) => [request, response][index]),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
  } as unknown as ExecutionContext;

  return {
    context,
    request,
    response,
  };
}
