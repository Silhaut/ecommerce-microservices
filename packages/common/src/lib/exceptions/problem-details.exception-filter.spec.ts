import { BadRequestException, type ArgumentsHost } from '@nestjs/common';
import { ProblemDetailsExceptionFilter } from './problem-details.exception-filter';

function createHost(url: string) {
  const response = {
    status: jest.fn().mockReturnThis(),
    contentType: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
  const request = { url };

  const host: Partial<ArgumentsHost> = {
    switchToHttp: () =>
      ({
        getResponse: () => response,
        getRequest: () => request,
      }) as never,
  };

  return { host: host as ArgumentsHost, response };
}

describe('ProblemDetailsExceptionFilter', () => {
  const filter = new ProblemDetailsExceptionFilter();

  it('maps an HttpException to a problem+json response', () => {
    const { host, response } = createHost('/orders/42');

    filter.catch(new BadRequestException('quantity must be positive'), host);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.contentType).toHaveBeenCalledWith(
      'application/problem+json',
    );
    expect(response.send).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        title: 'Bad Request',
        detail: 'quantity must be positive',
        instance: '/orders/42',
      }),
    );
  });

  it('maps an unknown error to a 500 without leaking internals', () => {
    const { host, response } = createHost('/orders/42');

    filter.catch(new Error('db connection refused'), host);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 500,
        title: 'Internal Server Error',
        detail: 'An unexpected error occurred.',
      }),
    );
  });
});
