import middy from "@middy/core";

export type HandlerError = {
  code: string;
  message: string;
  details: any[];
};

export interface HandleErrorMapper {
  getErrorCode(error: Error): string;
}

export const errorMiddleware = <TEvent>(handlerErrorMapper: HandleErrorMapper): middy.MiddlewareObj<TEvent, any> => {
  const onError: middy.MiddlewareFn<TEvent, any, Error | string> = async (request): Promise<void> => {
    const error = request.error as Error;
    const errorCode = handlerErrorMapper.getErrorCode(error);
    const errorResponse: HandlerError = {
      code: errorCode,
      message: error.message,
      details: [],
    };

    request.response = errorResponse;
  };

  return {
    onError,
  };
};
