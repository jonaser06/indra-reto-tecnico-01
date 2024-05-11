import "reflect-metadata";
import { Container } from "inversify";
import { mock } from "jest-mock-extended";

import { ListSpeciesHandler, handler } from "../../../src/handlers/list-species/handler";

const listSpeciesHandler = mock<ListSpeciesHandler>();

jest.mock("../../../src/common/container", () => {
  const container = mock<Container>();
  container.get.mockImplementation(() => listSpeciesHandler);
  const initContainer = () => container;
  return { initContainer };
});

describe("Middy test", () => {
  const getContext = () => ({
    referralParameters: {},
    callbackWaitsForEmptyEventLoop: false,
    functionName: "",
    functionVersion: "",
    invokedFunctionArn: "",
    memoryLimitInMB: "",
    awsRequestId: "",
    logGroupName: "",
    logStreamName: "",
    getRemainingTimeInMillis: jest.fn(),
    done: jest.fn(),
    fail: jest.fn(),
    succeed: jest.fn(),
  });

  test("handler should return", async () => {
    await handler({ id: "1" } as any, getContext());
  });
});
