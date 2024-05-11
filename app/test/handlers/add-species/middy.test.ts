import "reflect-metadata";
import { Container } from "inversify";
import { mock } from "jest-mock-extended";

import { AddSpeciesHandler, handler } from "../../../src/handlers/add-species/handler";

import { species } from "../../resources/species.json";

const addSpeciesHandler = mock<AddSpeciesHandler>();

jest.mock("../../../src/common/container", () => {
  const container = mock<Container>();
  container.get.mockImplementation(() => addSpeciesHandler);
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
    await handler(species as any, getContext());
  });
});
